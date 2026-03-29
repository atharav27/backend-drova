import {
    Controller,
    Get,
    Post,
    Query,
    Res,
    UseGuards,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';

import { HelperEncryptionService } from 'src/common/helper/services/helper.encryption.service';
import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { JwtRefreshGuard } from 'src/common/request/guards/jwt.refresh.guard';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import {
    AuthRefreshTokenDoc,
    AuthLogoutDoc,
    AuthRefreshDoc,
} from '../docs/auth.public.doc';
// import { AuthRefreshResponseDto } from '../dtos/auth.response.dto';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';

@ApiTags('public.auth')
@Controller({
    version: '1',
    path: '/auth',
})
export class AuthPublicController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly helperEncryptionService: HelperEncryptionService
    ) {}

    @AuthRefreshTokenDoc()
    @PublicRoute()
    @UseGuards(JwtRefreshGuard)
    @Get('refresh-token')
    public async refreshTokens(
        @AuthUser() user: IAuthUser,
        @Res({ passthrough: true }) res: Response
    ): Promise<{ message: string }> {
        const result = await this.authService.refreshTokens(user);

        // Set the new access token cookie
        this.cookieService.setAccessTokenCookie(
            res,
            user.role,
            result.accessToken
        );

        return { message: 'Access token refreshed successfully' };
    }

    @AuthRefreshDoc()
    @PublicRoute()
    @Post('refresh')
    public async refreshByRole(
        @Res({ passthrough: true }) res: Response
    ): Promise<{ message: string }> {
        // Refresh ALL roles that have valid refresh tokens
        const rolePriority = [Role.BUYER, Role.SELLER, Role.DRIVER];
        const refreshedRoles: Role[] = [];
        const failedRoles: Role[] = [];

        // Check each role and refresh if refresh token is valid
        for (const role of rolePriority) {
            const accessCookie =
                res.req.cookies[`drova_${role.toLowerCase()}_access`];
            const refreshCookie =
                res.req.cookies[`drova_${role.toLowerCase()}_refresh`];

            if (refreshCookie) {
                try {
                    // Verify refresh token is valid
                    const refreshPayload = this.jwtService.verify(
                        refreshCookie,
                        {
                            secret: this.configService.get<string>(
                                'auth.refreshToken.secret'
                            ),
                        }
                    );

                    if (refreshPayload.role === role) {
                        // Check if access token is expired or missing
                        let needsRefresh = false;

                        if (!accessCookie) {
                            // Access token missing, definitely needs refresh
                            needsRefresh = true;
                        } else {
                            try {
                                // Try to verify access token
                                this.jwtService.verify(accessCookie, {
                                    secret: this.configService.get<string>(
                                        'auth.accessToken.secret'
                                    ),
                                });
                                // Access token is still valid, no refresh needed
                            } catch {
                                // Access token is expired, needs refresh
                                needsRefresh = true;
                            }
                        }

                        if (needsRefresh) {
                            try {
                                // Generate new access token
                                const newAccessToken =
                                    await this.helperEncryptionService.createAccessToken(
                                        {
                                            userId: refreshPayload.userId,
                                            role: refreshPayload.role,
                                        }
                                    );

                                // Set the new access token cookie
                                this.cookieService.setAccessTokenCookie(
                                    res,
                                    role,
                                    newAccessToken
                                );

                                refreshedRoles.push(role);
                            } catch (error) {
                                failedRoles.push(role);
                            }
                        }
                    }
                } catch {
                    // Refresh token is invalid, skip this role
                    continue;
                }
            }
        }

        if (refreshedRoles.length === 0) {
            throw new UnauthorizedException(
                'No valid refresh token found for any role'
            );
        }

        let message = `Access tokens refreshed successfully for ${refreshedRoles.join(', ')} role(s)`;

        if (failedRoles.length > 0) {
            message += `. Failed to refresh: ${failedRoles.join(', ')}`;
        }

        return { message };
    }

    @AuthLogoutDoc()
    @PublicRoute()
    @Post('logout')
    public async logoutFromAllRoles(
        @Res({ passthrough: true }) res: Response
    ): Promise<{ roles: string[]; message: string }> {
        // Check for all active roles and clear them
        const allRoles = [Role.BUYER, Role.SELLER, Role.DRIVER];
        const activeRoles: Role[] = [];

        for (const role of allRoles) {
            const accessCookie =
                res.req.cookies[`drova_${role.toLowerCase()}_access`];
            const refreshCookie =
                res.req.cookies[`drova_${role.toLowerCase()}_refresh`];

            if (accessCookie || refreshCookie) {
                activeRoles.push(role);
                // Clear cookies for this role
                this.cookieService.clearRoleCookies(res, role);
            }
        }

        if (activeRoles.length === 0) {
            throw new UnauthorizedException(
                'No valid cookies found for any role'
            );
        }

        return {
            message: `Logged out successfully from all roles: ${activeRoles.join(', ')}`,
            roles: activeRoles,
        };
    }
}
