/* eslint-disable prettier/prettier */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import {
    AuthMeResponseDto,
    SuccessResponseDto,
    RoleMessageResponseDto,
    SigninResponseDto,
    SendOtpResponseDto,
    AddRoleResponseDto,
} from '../dtos/auth.response.dto';

export function SendOtpDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Send OTP to phone number',
            description:
                'Send OTP to phone number for registration or signin. Requires intent parameter to differentiate between flows. For registration, user must not exist. For signin, user must exist.',
        }),
        DocResponse({
            serialization: SendOtpResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([
            HttpStatus.CONFLICT,
            HttpStatus.NOT_FOUND,
            HttpStatus.BAD_REQUEST,
        ])
    );
}

export function VerifyOtpOnlyDoc() {
    return applyDecorators(
        ApiOperation({ summary: 'Verify OTP only' }),
        DocResponse({
            serialization: SuccessResponseDto,
            httpStatus: HttpStatus.OK,
        })
    );
}

export function RegisterDoc() {
    return applyDecorators(
        ApiOperation({ summary: 'Register new user' }),
        DocResponse({
            serialization: SigninResponseDto,
            httpStatus: HttpStatus.CREATED,
        })
    );
}

export function SigninDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Sign in user to all available roles',
            description:
                'Automatically detects all available roles for the user and signs them in to all roles simultaneously. No role parameter needed.',
        }),
        DocResponse({
            serialization: SigninResponseDto,
            httpStatus: HttpStatus.OK,
        })
    );
}

export function AuthMeDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get current user info',
            description:
                'Verify user authentication and return all available roles. All valid access tokens are checked and returned as an array.',
        }),
        DocResponse({
            serialization: AuthMeResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED])
    );
}

export function AddRoleDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Add new role to user account',
            description:
                'Add a new role to an authenticated user account by uploading required documents. The backend automatically detects which role to add based on the documents provided. User can only add roles to their own account.',
        }),
        DocResponse({
            serialization: AddRoleResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.CONFLICT,
            HttpStatus.BAD_REQUEST,
            HttpStatus.FORBIDDEN,
        ])
    );
}
