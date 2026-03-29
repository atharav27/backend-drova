import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiCookieAuth,
} from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocGenericResponse } from 'src/common/doc/decorators/doc.generic.decorator';
import { DocPaginatedResponse } from 'src/common/doc/decorators/doc.paginated.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import {
    VehiclePostCreateResponseDto,
    VehiclePostResponseDto,
    VehiclePostUpdateResponseDto,
    VehiclePostContactResponseDto,
} from '../dtos/response/vehicle-post.response';

export function VehiclePostPublicCreateDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Create a new post' }),
        DocResponse({
            serialization: VehiclePostCreateResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED])
    );
}

export function VehiclePostPublicDeleteDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Delete a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        DocGenericResponse(),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function VehiclePostPublicGetAllDoc() {
    return applyDecorators(
        ApiOperation({ summary: 'Get all posts' }),
        DocPaginatedResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.BAD_REQUEST])
    );
}

export function VehiclePostPublicGetByIdDoc() {
    return applyDecorators(
        ApiOperation({ summary: 'Get a post by ID' }),
        DocResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND])
    );
}

export function VehiclePostPublicGetByUserIdDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Get all posts by a specific user' }),
        DocPaginatedResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function VehiclePostPublicUpdateDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Update a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        DocResponse({
            serialization: VehiclePostUpdateResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function VehiclePostPublicUpdateStatusDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Update the status of a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                },
            },
        }),
        DocResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function VehiclePostAdminApproveStatusDoc() {
    return applyDecorators(
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Approve a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        DocResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function VehiclePostAdminRejectStatusDoc() {
    return applyDecorators(
        ApiCookieAuth('sellerAccess'),
        ApiOperation({ summary: 'Reject a post' }),
        ApiParam({ name: 'id', description: 'Post ID' }),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    note: { type: 'string' },
                },
            },
        }),
        DocResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

// Save/Bookmark functionality documentation
export function VehiclePostPublicSaveDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({
            summary: 'Save/bookmark a vehicle post',
            description:
                'Allows authenticated users to save a vehicle post to their bookmarks for later viewing',
        }),
        ApiParam({ name: 'id', description: 'Vehicle Post ID to save' }),
        DocGenericResponse(),
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
        ])
    );
}

export function VehiclePostPublicUnsaveDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({
            summary: 'Remove vehicle post from bookmarks',
            description:
                'Allows authenticated users to remove a previously saved vehicle post from their bookmarks',
        }),
        ApiParam({ name: 'id', description: 'Vehicle Post ID to unsave' }),
        DocGenericResponse(),
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
        ])
    );
}

export function VehiclePostPublicGetSavedDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({
            summary: "Get user's saved vehicle posts",
            description:
                'Retrieves all vehicle posts that a specific user has saved/bookmarked with pagination and search support',
        }),
        ApiParam({
            name: 'userId',
            description: 'User ID to get saved posts for',
        }),
        DocPaginatedResponse({
            serialization: VehiclePostResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND])
    );
}

export function VehiclePostPublicGetContactDoc() {
    return applyDecorators(
        ApiOperation({
            summary: 'Get seller contact information for a vehicle post',
            description:
                'Retrieves the contact name and contact number of the seller for a specific vehicle post',
        }),
        ApiParam({ name: 'id', description: 'Vehicle Post ID' }),
        DocResponse({
            serialization: VehiclePostContactResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND])
    );
}

export function VehiclePostPublicGetSavedStatusDoc() {
    return applyDecorators(
        ApiCookieAuth('buyerAccess'),
        ApiCookieAuth('sellerAccess'),
        ApiOperation({
            summary: 'Check if a vehicle post is saved by the current user',
            description:
                'Returns whether the currently authenticated user has saved the specified vehicle post',
        }),
        ApiParam({ name: 'id', description: 'Vehicle Post ID' }),
        DocResponse({
            serialization: Object,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}
