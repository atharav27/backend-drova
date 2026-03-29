import { Role } from '@prisma/client';

export interface IAuthUser {
    userId: string;
    role: Role; // role the user is currently acting as (from JWT)
}

export interface IRequest {
    user: IAuthUser;
}
