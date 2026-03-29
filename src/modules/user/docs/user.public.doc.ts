// user.public.doc.ts
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import {
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
    UserBuyerProfileDto,
    UserDriverProfileDto,
    UserSellerProfileDto,
} from '../dtos/response/user.response';

export function UserPublicGetProfileDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Get role-specific user profile',
            description:
                'Returns user profile data based on their role (BUYER, DRIVER, or SELLER). Each role returns different fields:\n' +
                '- BUYER: Basic profile information\n' +
                '- DRIVER: Basic info + license details (licenseNumber, licenseCategory, etc.)\n' +
                '- SELLER: Basic info + business details (panNumber, aadhaarNumber, etc.)',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'User profile retrieved successfully',
            content: {
                'application/json': {
                    schema: {
                        oneOf: [
                            {
                                $ref: '#/components/schemas/UserBuyerProfileDto',
                            },
                            {
                                $ref: '#/components/schemas/UserDriverProfileDto',
                            },
                            {
                                $ref: '#/components/schemas/UserSellerProfileDto',
                            },
                        ],
                    },
                    examples: {
                        buyer: {
                            summary: 'Buyer Profile',
                            value: {
                                id: '550e8400-e29b-41d4-a716-446655440000',
                                email: 'buyer@example.com',
                                userName: 'buyer_user',
                                fullName: 'John Doe',
                                phone: '+911234567890',
                                city: 'Mumbai',
                                role: ['BUYER'],
                                isVerified: true,
                                verificationStatus: 'VERIFIED',
                                verificationNote: null,
                                avatar: null,
                                documents: {
                                    aadhaarNumber: null,
                                    aadhaarCardImage: null,
                                    panNumber: null,
                                    panCardImage: null,
                                    licenseNumber: null,
                                    licenseCategory: null,
                                    licenseFrontImage: null,
                                },
                                activeListingCount: 0,
                                createdAt: '2024-01-15T10:30:00.000Z',
                                updatedAt: '2024-01-15T10:30:00.000Z',
                            },
                        },
                        driver: {
                            summary: 'Driver Profile',
                            value: {
                                id: '550e8400-e29b-41d4-a716-446655440001',
                                email: 'driver@example.com',
                                userName: 'driver_user',
                                fullName: 'Jane Smith',
                                phone: '+911234567891',
                                city: 'Delhi',
                                role: ['DRIVER'],
                                isVerified: true,
                                verificationStatus: 'VERIFIED',
                                verificationNote: null,
                                avatar: null,
                                documents: {
                                    aadhaarNumber: null,
                                    aadhaarCardImage: null,
                                    panNumber: null,
                                    panCardImage: null,
                                    licenseNumber: 'DL1234567890',
                                    licenseCategory: 'LMV',
                                    licenseFrontImage: 'license_front.jpg',
                                },
                                activeListingCount: 0,
                                dateOfBirth: '1990-01-01T00:00:00.000Z',
                                licenseNumber: 'DL1234567890',
                                licenseCategory: 'LMV',
                                licenseFrontImage: 'license_front.jpg',
                                createdAt: '2024-01-15T10:30:00.000Z',
                                updatedAt: '2024-01-15T10:30:00.000Z',
                            },
                        },
                        seller: {
                            summary: 'Seller Profile',
                            value: {
                                id: '550e8400-e29b-41d4-a716-446655440002',
                                email: 'seller@example.com',
                                userName: 'seller_user',
                                fullName: 'Bob Johnson',
                                phone: '+911234567892',
                                city: 'Bangalore',
                                role: ['SELLER'],
                                isVerified: true,
                                verificationStatus: 'PENDING',
                                verificationNote: null,
                                avatar: null,
                                documents: {
                                    aadhaarNumber: '123456789012',
                                    aadhaarCardImage: 'aadhaar_card.jpg',
                                    panNumber: 'ABCDE1234F',
                                    panCardImage: 'pan_card.jpg',
                                    licenseNumber: null,
                                    licenseCategory: null,
                                    licenseFrontImage: null,
                                },
                                activeListingCount: 5,
                                aadhaarNumber: '123456789012',
                                panNumber: 'ABCDE1234F',
                                panCardImage: 'pan_card.jpg',
                                createdAt: '2024-01-15T10:30:00.000Z',
                                updatedAt: '2024-01-15T10:30:00.000Z',
                            },
                        },
                    },
                },
            },
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function UserPublicUpdateProfileDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Update user profile',
            description:
                'Updates user profile information and returns the updated role-specific profile data. Different roles can update different fields:\n' +
                '- BUYER: Basic profile information\n' +
                '- DRIVER: Basic info + license details\n' +
                '- SELLER: Basic info + business details',
        }),
        ApiResponse({
            status: HttpStatus.OK,
            description: 'User profile updated successfully',
            content: {
                'application/json': {
                    schema: {
                        oneOf: [
                            {
                                $ref: '#/components/schemas/UserBuyerProfileDto',
                            },
                            {
                                $ref: '#/components/schemas/UserDriverProfileDto',
                            },
                            {
                                $ref: '#/components/schemas/UserSellerProfileDto',
                            },
                        ],
                    },
                },
            },
        }),
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
        ])
    );
}

export function UserPublicDeleteProfileDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Delete user profile',
            description:
                'Soft deletes the user profile. The user will be marked as deleted but data is preserved for compliance and audit purposes.',
        }),
        DocResponse({
            serialization: ApiGenericResponseDto,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
        ])
    );
}
