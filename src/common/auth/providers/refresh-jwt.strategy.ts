import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtRefreshStrategy.extractRefreshTokenFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('auth.refreshToken.secret'),
        });
    }

    private static extractRefreshTokenFromCookie(req: Request): string | null {
        if (req.cookies) {
            // Check for role-based refresh tokens
            const role = req.query.role || req.body?.role;
            if (role) {
                const cookieName = `drova_${role.toLowerCase()}_refresh`;
                return req.cookies[cookieName] || null;
            }

            // Check for any valid refresh token (for backward compatibility)
            const validTokens = [
                'drova_driver_refresh',
                'drova_buyer_refresh',
                'drova_seller_refresh',
            ];
            for (const tokenName of validTokens) {
                if (req.cookies[tokenName]) {
                    return req.cookies[tokenName];
                }
            }
        }
        return null;
    }

    async validate(payload: Record<string, string | number>) {
        return payload;
    }
}
