/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import {
    UserPublicGetProfileDoc,
    UserPublicUpdateProfileDoc,
    UserPublicDeleteProfileDoc,
} from '../docs/user.public.doc';
import { UserUpdateDto } from '../dtos/request/user.update.request';
import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
    UserProfileResponseDto,
} from '../dtos/response/user.response';
import { UserService } from '../services/user.service';

@ApiTags('public.user')
@Controller({
    path: '/user',
    version: '1',
})
export class UserPublicController {
    constructor(private readonly userService: UserService) {}

    @UserPublicGetProfileDoc()
    @Get('profile')
    public async getProfile(
        @AuthUser() user: IAuthUser
    ): Promise<UserProfileResponseDto> {
        return this.userService.getProfile(user.userId);
    }

    @UserPublicUpdateProfileDoc()
    @Put()
    public async update(
        @AuthUser() user: IAuthUser,
        @Body() payload: UserUpdateDto
    ): Promise<UserProfileResponseDto> {
        return this.userService.updateUser(user.userId, user.role, payload);
    }

    @UserPublicDeleteProfileDoc()
    @Delete()
    public async delete(
        @AuthUser() user: IAuthUser
    ): Promise<ApiGenericResponseDto> {
        return this.userService.deleteUser(user.userId);
    }
}
