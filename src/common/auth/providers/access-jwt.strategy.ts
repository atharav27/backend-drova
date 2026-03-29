/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
    Strategy,
    'jwt-access'
) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtAccessStrategy.extractTokenFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('auth.accessToken.secret'),
        });
    }

    private static extractTokenFromCookie(req: Request): string | null {
        if (req.cookies) {
            // Check for role-based access tokens
            const role = req.query.role || req.body?.role;
            if (role) {
                const cookieName = `drova_${role.toLowerCase()}_access`;
                return req.cookies[cookieName] || null;
            }

            // Check for any valid access token (for backward compatibility)
            const validTokens = [
                'drova_driver_access',
                'drova_buyer_access',
                'drova_seller_access',
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
