/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested, IsEnum } from 'class-validator';

import { UserResponseDto } from 'src/modules/user/dtos/response/user.response';

export class TokenDto {
    @ApiProperty({
        example: faker.string.alphanumeric({ length: 64 }),
        required: true,
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({
        example: faker.string.alphanumeric({ length: 64 }),
        required: true,
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class AuthResponseDto extends TokenDto {
    @ApiProperty({
        type: () => UserResponseDto,
        required: true,
    })
    @Expose()
    @Type(() => UserResponseDto)
    @ValidateNested()
    user: UserResponseDto;

    @ApiProperty({
        type: () => [RoleTokenDto],
        required: false,
        description: 'Tokens for all available roles',
        isArray: true,
    })
    @Expose()
    @Type(() => RoleTokenDto)
    @ValidateNested({ each: true })
    allRoleTokens?: RoleTokenDto[];
}

export class RoleTokenDto {
    @ApiProperty({
        example: 'BUYER',
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'Role name',
    })
    @Expose()
    @IsEnum(Role)
    role: Role;

    @ApiProperty({
        example: faker.string.alphanumeric({ length: 64 }),
        description: 'Access token for this role',
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({
        example: faker.string.alphanumeric({ length: 64 }),
        description: 'Refresh token for this role',
    })
    @Expose()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class AuthRefreshResponseDto extends TokenDto {}

export class AuthMeResponseDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'User ID',
    })
    @Expose()
    userId: string;

    @ApiProperty({
        example: ['BUYER', 'SELLER'],
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'All available roles for the user',
        isArray: true,
    })
    @Expose()
    roles: string[];
}

export class AuthLogoutResponseDto {
    @ApiProperty({
        example: ['DRIVER', 'BUYER'],
        type: [String],
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'Roles that were logged out from',
    })
    @Expose()
    roles: string[];

    @ApiProperty({
        example: 'Logged out successfully from all roles: BUYER, DRIVER',
        description: 'Success message',
    })
    @Expose()
    message: string;
}

export class SuccessResponseDto {
    @ApiProperty({
        example: true,
        description: 'Success status',
    })
    @Expose()
    success: boolean;
}

export class RoleMessageResponseDto {
    @ApiProperty({
        example: 'DRIVER',
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'User role',
    })
    @Expose()
    role: string;

    @ApiProperty({
        example: 'Registration successful. Tokens set in cookies.',
        description: 'Success message',
    })
    @Expose()
    message: string;
}

export class SigninResponseDto {
    @ApiProperty({
        example: ['BUYER', 'SELLER'],
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'All roles the user was signed in to',
        isArray: true,
    })
    @Expose()
    roles: Role[];

    @ApiProperty({
        example:
            'Sign in successful. Tokens set in cookies for BUYER, SELLER role(s).',
        description: 'Success message',
    })
    @Expose()
    message: string;
}

export class SendOtpResponseDto {
    @ApiProperty({
        example: true,
        description: 'Success status',
    })
    @Expose()
    success: boolean;

    @ApiProperty({
        example: 'OTP sent successfully for registration',
        description: 'Success message with context',
    })
    @Expose()
    message: string;
}

export class AddRoleResponseDto {
    @ApiProperty({
        example: true,
        description: 'Success status',
    })
    @Expose()
    success: boolean;

    @ApiProperty({
        example: 'Role DRIVER added successfully to your account',
        description: 'Success message with the new role added',
    })
    @Expose()
    message: string;

    @ApiProperty({
        example: 'DRIVER',
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'The role that was added',
    })
    @Expose()
    @IsEnum(Role)
    addedRole: Role;

    @ApiProperty({
        example: ['BUYER', 'DRIVER'],
        enum: ['DRIVER', 'BUYER', 'SELLER'],
        description: 'Array of all roles the user now has',
        isArray: true,
    })
    @Expose()
    @IsEnum(Role, { each: true })
    availableRoles: Role[];
}
