import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { JwtAccessGuard } from './guards/jwt.access.guard';
import { RolesGuard } from './guards/roles.guard';
import { RoleBasedAuthGuard } from './guards/role-based-auth.guard';
import { RequestLoggerMiddleware } from './middlewares/request.middleware';

@Module({
    imports: [
        JwtModule.register({}),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                throttlers: [
                    {
                        ttl: configService.get('app.throttle.ttl'),
                        limit: configService.get('app.throttle.limit'),
                    },
                ],
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [RoleBasedAuthGuard],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAccessGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        RoleBasedAuthGuard,
    ],
})
export class RequestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
