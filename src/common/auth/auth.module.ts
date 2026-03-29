import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';

import { DatabaseModule } from '../database/database.module';
import { HelperModule } from '../helper/helper.module';

import { AuthPhoneController } from './controllers/auth.phone.controller';
import { AuthPublicController } from './controllers/auth.public.controller';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';
import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';

@Module({
    controllers: [AuthPublicController, AuthPhoneController],
    imports: [
        HelperModule,
        PassportModule,
        DatabaseModule,
        JwtModule.register({}),
        BullModule.registerQueue({
            name: APP_BULL_QUEUES.EMAIL,
        }),
    ],
    providers: [
        AuthService,
        CookieService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
    exports: [
        AuthService,
        CookieService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
    ],
})
export class AuthModule {}
