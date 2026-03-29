/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class CookieService {
    constructor(private readonly configService: ConfigService) {}

    private baseCookieOptions() {
        const domainEnv = this.configService.get<string>('APP_COOKIE_DOMAIN');
        const secureEnv = this.configService.get<string>('APP_COOKIE_SECURE');
        const sameSiteEnv = this.configService.get<string>(
            'APP_COOKIE_SAMESITE'
        );

        // Debug: Log raw env values
        console.log('🔧 Raw env values:', {
            domainEnv: JSON.stringify(domainEnv),
            secureEnv,
            sameSiteEnv,
        });

        const secure = secureEnv === 'true';
        const sameSite =
            (sameSiteEnv?.toLowerCase() as 'lax' | 'strict' | 'none') || 'lax';

        // Clean up domain value and only include if not empty
        const domain = domainEnv?.trim();

        // Build options object dynamically
        const options: any = {
            path: '/',
            httpOnly: true,
            secure,
            sameSite,
        };

        // Only add domain if it's a non-empty string
        if (domain) {
            options.domain = domain;
        }

        console.log('🔧 Final domain value:', JSON.stringify(domain));

        return options;
    }

    setRoleCookies(
        res: Response,
        role: Role,
        accessToken: string,
        refreshToken: string
    ): void {
        const roleLower = role.toLowerCase();
        const options = this.baseCookieOptions();

        // Debug log to verify cookie configuration
        console.log(
            '🍪 Setting cookies with options:',
            JSON.stringify(options, null, 2)
        );
        console.log(
            '🍪 Cookie names:',
            `drova_${roleLower}_access`,
            `drova_${roleLower}_refresh`
        );

        // Set access token cookie
        res.cookie(`drova_${roleLower}_access`, accessToken, {
            ...options,
            maxAge: 30 * 60 * 1000,
        });

        // Set refresh token cookie
        res.cookie(`drova_${roleLower}_refresh`, refreshToken, {
            ...options,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        console.log('✅ Cookies set successfully for role:', role);
    }

    setAccessTokenCookie(res: Response, role: Role, accessToken: string): void {
        const roleLower = role.toLowerCase();

        res.cookie(`drova_${roleLower}_access`, accessToken, {
            ...this.baseCookieOptions(),
            maxAge: 30 * 60 * 1000, // 30 minutes
        });
    }

    clearRoleCookies(res: Response, role: Role): void {
        const roleLower = role.toLowerCase();

        // Clear access token cookie
        res.cookie(`drova_${roleLower}_access`, '', {
            ...this.baseCookieOptions(),
            maxAge: 0,
            expires: new Date(0),
        });

        // Clear refresh token cookie
        res.cookie(`drova_${roleLower}_refresh`, '', {
            ...this.baseCookieOptions(),
            maxAge: 0,
            expires: new Date(0),
        });
    }

    getCookieName(role: Role, type: 'access' | 'refresh'): string {
        return `drova_${role.toLowerCase()}_${type}`;
    }
}
