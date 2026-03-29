import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import {
    ROLES_DECORATOR_KEY,
    PUBLIC_ROUTE_KEY,
} from '../constants/request.constant';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Check if route is public - if so, skip role checking
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_ROUTE_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) {
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_DECORATOR_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            throw new ForbiddenException('auth.error.userRoleNotDefined');
        }

        // user.role here represents the role selected at signin (from JWT)
        const hasRole = requiredRoles.some(role => user.role === role);

        if (!hasRole) {
            throw new ForbiddenException('auth.error.insufficientPermissions');
        }

        return true;
    }
}
