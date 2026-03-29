/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Get,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';

import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';

import { HelperEncryptionService } from '../../helper/services/helper.encryption.service';
import {
    SendOtpDoc,
    VerifyOtpOnlyDoc,
    RegisterDoc,
    SigninDoc,
    AuthMeDoc,
    AddRoleDoc,
} from '../docs/auth.phone.doc';
import {
    RegisterDto,
    VerifyOtpDto,
    SigninDto,
    AddRoleDto,
} from '../dtos/auth.register.dto';
import {
    SendOtpResponseDto,
    AddRoleResponseDto,
} from '../dtos/auth.response.dto';
import { SendOtpDto } from '../dtos/auth.send-otp.dto';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';

@ApiTags('public.auth.phone')
@Controller({
    version: '1',
    path: '/auth/phone',
})
export class AuthPhoneController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly helperEncryptionService: HelperEncryptionService,
        private readonly cookieService: CookieService
    ) {}

    @AuthMeDoc()
    @PublicRoute()
    @Get('me')
    public async getCurrentUser(
        @Res({ passthrough: true }) res: Response
    ): Promise<{ userId: string; roles: Role[] }> {
        const availableRoles: Role[] = [];
        let primaryRole: Role | null = null;
        let primaryAccessToken: string | null = null;

        // Check all possible role cookies and collect available roles
        const rolePriority = [Role.BUYER, Role.SELLER, Role.DRIVER];

        for (const role of rolePriority) {
            const cookieName = `drova_${role.toLowerCase()}_access`;
            const token = res.req.cookies[cookieName];

            if (token) {
                try {
                    // Try to verify this token
                    const payload = this.jwtService.verify(token, {
                        secret: this.configService.get<string>(
                            'auth.accessToken.secret'
                        ),
                    });

                    // Check if token role matches cookie role
                    if (payload.role === role) {
                        availableRoles.push(role);

                        // Set primary role as first valid role found
                        if (!primaryRole) {
                            primaryRole = role;
                            primaryAccessToken = token;
                        }
                    }
                } catch {
                    // Token is invalid/expired, skip this role
                    continue;
                }
            }
        }

        if (availableRoles.length === 0) {
            // Return null/empty response instead of 401 for unauthenticated users
            return { userId: null, roles: [] };
        }

        // Verify the primary role token again (double-check)
        try {
            const payload = this.jwtService.verify(primaryAccessToken, {
                secret: this.configService.get<string>(
                    'auth.accessToken.secret'
                ),
            });

            return {
                userId: payload.userId,
                roles: availableRoles,
            };
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    @SendOtpDoc()
    @PublicRoute()
    @Post('send-otp')
    public async sendOtp(
        @Body() payload: SendOtpDto
    ): Promise<SendOtpResponseDto> {
        return this.authService.sendOtp(payload.phone, payload.intent);
    }

    @VerifyOtpOnlyDoc()
    @PublicRoute()
    @Post('verify-otp-only')
    public async verifyOtpOnly(
        @Body() payload: VerifyOtpDto
    ): Promise<{ success: boolean }> {
        return this.authService.verifyOtpOnly(payload);
    }

    @RegisterDoc()
    @PublicRoute()
    @Post('register')
    public async register(
        @Body() payload: RegisterDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{ roles: Role[]; message: string }> {
        const result = await this.authService.register(payload);

        // Set cookies for the registered role
        this.cookieService.setRoleCookies(
            res,
            result.user.role,
            result.accessToken,
            result.refreshToken
        );

        return {
            roles: [result.user.role],
            message: 'Registration successful. Tokens set in cookies.',
        };
    }

    @SigninDoc()
    @PublicRoute()
    @Post('signin')
    public async signin(
        @Body() payload: SigninDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<{ roles: Role[]; message: string }> {
        const result = await this.authService.signin(payload);

        // Set cookies for ALL available roles
        if (result.allRoleTokens) {
            for (const roleToken of result.allRoleTokens) {
                this.cookieService.setRoleCookies(
                    res,
                    roleToken.role,
                    roleToken.accessToken,
                    roleToken.refreshToken
                );
            }
        }

        // Extract role names for response
        const roles: Role[] = result.allRoleTokens?.map(rt => rt.role) || [
            result.user.role,
        ];

        return {
            roles,
            message: `Sign in successful. Tokens set in cookies for ${roles.join(', ')} role(s).`,
        };
    }

    @AddRoleDoc()
    @Post('add-role')
    public async addRole(
        @AuthUser() user: IAuthUser,
        @Body() payload: AddRoleDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<AddRoleResponseDto> {
        const result = await this.authService.addRole(payload, user.userId);

        // Generate tokens for the new role and set cookies
        const accessToken =
            await this.helperEncryptionService.createAccessToken({
                userId: user.userId,
                role: result.addedRole,
            });

        const refreshToken =
            await this.helperEncryptionService.createRefreshToken({
                userId: user.userId,
                role: result.addedRole,
            });

        // Set cookies for the new role
        this.cookieService.setRoleCookies(
            res,
            result.addedRole,
            accessToken,
            refreshToken
        );

        return result;
    }
}
