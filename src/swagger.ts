/* eslint-disable prettier/prettier */
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function setupSwagger(
    app: INestApplication
): Promise<void> {
    const configService = app.get(ConfigService);
    const logger = new Logger('SwaggerSetup');

    const swaggerConfig = {
        name: configService.get<string>('doc.name', 'API Documentation'),
        description: configService.get<string>(
            'doc.description',
            'API Description'
        ),
        version: configService.get<string>('doc.version', '1.0'),
        prefix: configService.get<string>('doc.prefix', 'api'),
    };

    const documentBuild = new DocumentBuilder()
        .setTitle(swaggerConfig.name)
        .setDescription(swaggerConfig.description)
        .setVersion(swaggerConfig.version)
        .addCookieAuth(
            'drova_driver_access',
            {
                type: 'apiKey',
                in: 'cookie',
                name: 'drova_driver_access',
                description: 'Driver access token cookie',
            },
            'driverAccess'
        )
        .addCookieAuth(
            'drova_buyer_access',
            {
                type: 'apiKey',
                in: 'cookie',
                name: 'drova_buyer_access',
                description: 'Buyer access token cookie',
            },
            'buyerAccess'
        )
        .addCookieAuth(
            'drova_seller_access',
            {
                type: 'apiKey',
                in: 'cookie',
                name: 'drova_seller_access',
                description: 'Seller access token cookie',
            },
            'sellerAccess'
        )
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'accessToken',
                description: 'Enter your access token (legacy support)',
                in: 'header',
            },
            'accessToken'
        )
        .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
        deepScanRoutes: true,
    });

    SwaggerModule.setup('docs', app, document, {
        explorer: true,
        customSiteTitle: swaggerConfig.name,
        swaggerOptions: {
            docExpansion: 'none',
            persistAuthorization: true,
            displayOperationId: true,
            operationsSorter: 'method',
            tagsSorter: 'alpha',
            tryItOutEnabled: true,
            filter: true,
            withCredentials: true,
        },
    });

    logger.log(`Swagger documentation available at /docs`);
}
