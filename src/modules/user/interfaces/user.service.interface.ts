/* eslint-disable prettier/prettier */
import { Role } from '@prisma/client';

import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { UserUpdateDto } from '../dtos/request/user.update.request';
import { UserProfileResponseDto } from '../dtos/response/user.response';

export interface IUserService {
    updateUser(
        userId: string,
        actingRole: Role,
        data: UserUpdateDto
    ): Promise<UserProfileResponseDto>;
    deleteUser(userId: string): Promise<ApiGenericResponseDto>;
    getProfile(userId: string): Promise<UserProfileResponseDto>;
}
