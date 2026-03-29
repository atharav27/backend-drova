/* eslint-disable prettier/prettier */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import {
    AuthRefreshResponseDto,
    AuthMeResponseDto,
    AuthLogoutResponseDto,
} from '../dtos/auth.response.dto';

export function AuthRefreshTokenDoc() {
    return applyDecorators(
        ApiBearerAuth('refreshToken'),
        ApiOperation({ summary: 'Refresh token' }),
        DocResponse({
            serialization: AuthRefreshResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED])
    );
}

export function AuthRefreshDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Refresh access tokens for all roles',
            description:
                'Automatically detects and refreshes access tokens for all roles that have valid refresh tokens. No role parameter needed.',
        }),
        DocResponse({
            serialization: AuthRefreshResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED])
    );
}

export function AuthMeDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get current user info',
            description:
                'Verify user authentication and return basic user information. Role is automatically detected from available cookies.',
        }),
        DocResponse({
            serialization: AuthMeResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED])
    );
}

export function AuthLogoutDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Logout from all roles',
            description:
                'Logout user from ALL authenticated roles. This will clear cookies for BUYER, SELLER, and DRIVER roles if they exist.',
        }),
        DocResponse({
            serialization: AuthLogoutResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED])
    );
}
