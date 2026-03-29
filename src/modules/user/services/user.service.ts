/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { Role, User, VehiclePostStatus } from '@prisma/client';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { UserUpdateDto } from '../dtos/request/user.update.request';
import {
    UserProfileResponseDto,
    UserBuyerProfileDto,
    UserDriverProfileDto,
    UserSellerProfileDto,
} from '../dtos/response/user.response';
import { IUserService } from '../interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(private readonly prismaService: PrismaService) {}

    /**
     * Helper method to map user data to role-specific profile
     */
    private mapUserToRoleProfile(user: User): UserProfileResponseDto {
        // Get all roles as array (this is the new structure)
        const allRoles = (user as any).role || [Role.BUYER];

        // Base profile data (common to all roles)
        const baseProfile = {
            id: user.id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            phone: user.phone,
            city: user.city,
            // All available roles for this user as array
            role: allRoles,
            isVerified: user.isVerified,
            verificationStatus: user.verificationStatus,
            verificationNote: user.verificationNote,
            avatar: user.avatar,
            documents: {
                aadhaarNumber: user.aadhaarNumber,
                aadhaarCardImage: user.aadhaarCardImage,
                panNumber: user.panNumber,
                panCardImage: user.panCardImage,
                licenseNumber: user.licenseNumber,
                licenseCategory: user.licenseCategory,
                licenseFrontImage: user.licenseFrontImage,
            },
            activeListingCount: (user as any).activeListingCount || 0,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        // Determine profile type based on available roles
        // If user has SELLER role, return seller profile with business info
        if (allRoles.includes(Role.SELLER)) {
            return {
                ...baseProfile,
                aadhaarNumber: user.aadhaarNumber,
                panNumber: user.panNumber,
                panCardImage: user.panCardImage,
            } as UserSellerProfileDto;
        }

        // If user has DRIVER role, return driver profile with license info
        if (allRoles.includes(Role.DRIVER)) {
            return {
                ...baseProfile,
                dateOfBirth: user.dateOfBirth,
                licenseNumber: user.licenseNumber,
                licenseCategory: user.licenseCategory,
                licenseFrontImage: user.licenseFrontImage,
            } as UserDriverProfileDto;
        }

        // Default to buyer profile
        return {
            ...baseProfile,
        } as UserBuyerProfileDto;
    }

    async updateUser(
        userId: string,
        actingRole: Role,
        data: UserUpdateDto
    ): Promise<UserProfileResponseDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
                include: {
                    roles: true, // Include all user roles
                },
            });
            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Update user data
            const updatedUser = await this.prismaService.user.update({
                where: { id: userId },
                data,
                include: {
                    roles: true, // Include all user roles in response
                },
            });

            // Extract all roles and attach current acting role
            const allUserRoles = updatedUser.roles.map(
                userRole => userRole.role
            );
            const userWithRoles = {
                ...updatedUser,
                role: actingRole, // Current acting role
                allRoles: allUserRoles, // All available roles
            } as unknown as User;
            return this.mapUserToRoleProfile(userWithRoles);
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: string): Promise<ApiGenericResponseDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Check if user is already deleted
            if (user.deletedAt) {
                throw new HttpException(
                    'user.error.userAlreadyDeleted',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Soft delete the user
            await this.prismaService.user.update({
                where: { id: userId },
                data: { deletedAt: new Date() },
            });

            return {
                success: true,
                message: 'user.success.userDeleted',
            };
        } catch (error) {
            throw error;
        }
    }

    async getProfile(id: string): Promise<UserProfileResponseDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id },
                include: {
                    roles: true, // Include all user roles
                },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Count user's active listings (published & not soft-deleted)
            const activeListingCount =
                await this.prismaService.vehiclePost.count({
                    where: {
                        userId: user.id,
                        status: VehiclePostStatus.PUBLISHED,
                        deletedAt: null,
                    },
                });

            // Extract all roles and attach as role array
            const allUserRoles = user.roles.map(userRole => userRole.role);
            const userWithRoles = {
                ...user,
                role: allUserRoles, // All available roles as array
                activeListingCount, // Add active listing count
            } as unknown as User;
            return this.mapUserToRoleProfile(userWithRoles);
        } catch (error) {
            throw error;
        }
    }
}
