/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';

import {
    ROUTE_CONTEXT_KEY,
    PUBLIC_ROUTE_KEY,
} from '../constants/request.constant';

export enum RouteContext {
    MARKETPLACE = 'marketplace',
    DRIVER = 'driver',
}

@Injectable()
export class RoleBasedAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean {
        // Check if route is public - if so, skip authentication
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_ROUTE_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) {
            return true;
        }

        const routeContext = this.reflector.getAllAndOverride<RouteContext>(
            ROUTE_CONTEXT_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!routeContext) {
            // If no route context is specified, allow access (fallback to default JWT guard)
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const cookies = request.cookies;

        if (!cookies) {
            throw new UnauthorizedException('No cookies found');
        }

        let validToken: string | null = null;
        let userRole: Role | null = null;

        if (routeContext === RouteContext.MARKETPLACE) {
            // For marketplace routes, check buyer or seller access tokens
            if (cookies.drova_buyer_access) {
                validToken = cookies.drova_buyer_access;
                userRole = Role.BUYER;
            } else if (cookies.drova_seller_access) {
                validToken = cookies.drova_seller_access;
                userRole = Role.SELLER;
            }
        } else if (routeContext === RouteContext.DRIVER) {
            // For driver routes, only check driver access token
            if (cookies.drova_driver_access) {
                validToken = cookies.drova_driver_access;
                userRole = Role.DRIVER;
            }
        }

        if (!validToken || !userRole) {
            throw new UnauthorizedException(
                `Access denied for ${routeContext} routes. Valid ${routeContext} role token required.`
            );
        }

        try {
            // Verify the JWT token
            const payload = this.jwtService.verify(validToken);

            // Check if the token payload matches the expected role
            if (payload.role !== userRole) {
                throw new UnauthorizedException('Token role mismatch');
            }

            // Attach user info to request for use in controllers
            request.user = {
                userId: payload.userId,
                role: payload.role,
            };

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
