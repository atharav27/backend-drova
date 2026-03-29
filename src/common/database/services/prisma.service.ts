import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.warn('⚠️ Database connection failed:', error.message);
            console.warn(
                '⚠️ Continuing without database connection for testing...'
            );
        }
    }

    async isHealthy(): Promise<HealthIndicatorResult> {
        try {
            await this.$queryRaw`SELECT 1`;
            return Promise.resolve({
                prisma: {
                    status: 'up',
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return Promise.resolve({
                prisma: {
                    status: 'down',
                },
            });
        }
    }
}
