import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Queue } from 'bull';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';
import { PrismaService } from 'src/common/database/services/prisma.service';

import { HelperEncryptionService } from '../../helper/services/helper.encryption.service';
import { IAuthUser } from '../../request/interfaces/request.interface';
import {
    RegisterDto,
    VerifyOtpDto,
    SigninDto,
    AddRoleDto,
} from '../dtos/auth.register.dto';
import {
    AuthResponseDto,
    SendOtpResponseDto,
    AddRoleResponseDto,
} from '../dtos/auth.response.dto';
import { OtpIntent } from '../dtos/auth.send-otp.dto';
import { IAuthService } from '../interfaces/auth.service.interface';

import { CookieService } from './cookie.service';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly helperEncryptionService: HelperEncryptionService,
        private readonly cookieService: CookieService,
        @InjectQueue(APP_BULL_QUEUES.EMAIL)
        private emailQueue: Queue
    ) {}

    public async refreshTokens(
        payload: IAuthUser
    ): Promise<{ accessToken: string }> {
        const accessToken =
            await this.helperEncryptionService.createAccessToken({
                userId: payload.userId,
                role: payload.role,
            });

        return { accessToken };
    }

    public async sendOtp(
        phone: string,
        intent: OtpIntent
    ): Promise<SendOtpResponseDto> {
        try {
            // Check if user exists in database
            const existingUser = await this.prismaService.user.findUnique({
                where: { phone },
            });

            // Validate based on intent
            if (intent === OtpIntent.REGISTER) {
                if (existingUser) {
                    throw new HttpException(
                        'User already registered. Please use signin instead.',
                        HttpStatus.CONFLICT
                    );
                }
                return {
                    success: true,
                    message: 'OTP sent successfully for registration',
                };
            } else if (intent === OtpIntent.SIGNIN) {
                if (!existingUser) {
                    throw new HttpException(
                        'User not registered. Please register first.',
                        HttpStatus.NOT_FOUND
                    );
                }
                return {
                    success: true,
                    message: 'OTP sent successfully for signin',
                };
            }

            // This should never happen due to enum validation, but just in case
            throw new HttpException(
                'Invalid intent provided',
                HttpStatus.BAD_REQUEST
            );
        } catch (error) {
            throw error;
        }
    }

    public async verifyOtpOnly(
        data: VerifyOtpDto
    ): Promise<{ success: boolean }> {
        try {
            const { phone, otp } = data;

            // Extract last 6 digits from phone number for OTP verification
            const expectedOtp = phone.slice(-6);

            if (otp !== expectedOtp) {
                throw new HttpException(
                    'auth.error.invalidOtp',
                    HttpStatus.BAD_REQUEST
                );
            }

            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    public async register(data: RegisterDto): Promise<AuthResponseDto> {
        try {
            const { phone, fullName, city, ...roleSpecificData } = data;

            // Determine role based on the documents provided, not by documentType
            let inferredRole: Role;

            // Check if user has license details (DRIVER role)
            if (
                roleSpecificData.licenseNumber &&
                roleSpecificData.licenseCategory &&
                roleSpecificData.licenseFrontImage
            ) {
                inferredRole = Role.DRIVER;

                // Validate required fields for DRIVER
                if (!roleSpecificData.dateOfBirth) {
                    throw new HttpException(
                        'Date of birth is required for driver registration',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }
            // Check if user has both Aadhaar and PAN details (SELLER role)
            else if (
                roleSpecificData.aadhaarNumber &&
                roleSpecificData.aadhaarCardImage &&
                roleSpecificData.panNumber &&
                roleSpecificData.panCardImage
            ) {
                inferredRole = Role.SELLER;
            }
            // Check if user has only Aadhaar details (BUYER role)
            else if (
                roleSpecificData.aadhaarNumber &&
                roleSpecificData.aadhaarCardImage
            ) {
                inferredRole = Role.BUYER;
            }
            // No valid document combination found
            else {
                throw new HttpException(
                    'Invalid document combination. Please provide:\n' +
                        '- For DRIVER: License number, category, image, and date of birth\n' +
                        '- For SELLER: Both Aadhaar and PAN card details\n' +
                        '- For BUYER: Aadhaar card details only',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Check if user already exists
            let user = await this.prismaService.user.findUnique({
                where: { phone },
                include: { roles: true },
            });

            // Check if user already has this role
            if (user) {
                const existingRole = user.roles.find(
                    role => role.role === inferredRole
                );
                if (existingRole) {
                    throw new HttpException(
                        `User already registered as ${inferredRole}`,
                        HttpStatus.CONFLICT
                    );
                }
            }

            // If user doesn't exist, create new user
            if (!user) {
                const userData: any = {
                    phone,
                    userName: phone, // Use phone as username
                    fullName,
                    city,
                    isVerified: true, // Since OTP is verified
                };

                user = await this.prismaService.user.create({
                    data: userData,
                    include: { roles: true },
                });
            }

            // Update user with role-specific fields
            const updateData: any = {};

            if (inferredRole === Role.DRIVER) {
                updateData.dateOfBirth = new Date(roleSpecificData.dateOfBirth);
                updateData.licenseNumber = roleSpecificData.licenseNumber;
                updateData.licenseCategory = roleSpecificData.licenseCategory;
                updateData.licenseFrontImage =
                    roleSpecificData.licenseFrontImage;
            } else if (inferredRole === Role.SELLER) {
                updateData.panNumber = roleSpecificData.panNumber;
                updateData.panCardImage = roleSpecificData.panCardImage;
                updateData.aadhaarNumber = roleSpecificData.aadhaarNumber;
                updateData.aadhaarCardImage = roleSpecificData.aadhaarCardImage;
            } else if (inferredRole === Role.BUYER) {
                updateData.aadhaarNumber = roleSpecificData.aadhaarNumber;
                updateData.aadhaarCardImage = roleSpecificData.aadhaarCardImage;
            }

            // Update user with role-specific data
            user = await this.prismaService.user.update({
                where: { id: user.id },
                data: updateData,
                include: { roles: true },
            });

            // Add the new role to user_roles table
            await this.prismaService.userRole.create({
                data: {
                    userId: user.id,
                    role: inferredRole,
                },
            });

            // Generate tokens
            const accessToken =
                await this.helperEncryptionService.createAccessToken({
                    userId: user.id,
                    role: inferredRole,
                });

            const refreshToken =
                await this.helperEncryptionService.createRefreshToken({
                    userId: user.id,
                    role: inferredRole,
                });

            return {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    userName: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    city: user.city,
                    dateOfBirth: user.dateOfBirth,
                    phone: user.phone,
                    role: inferredRole,
                    isVerified: user.isVerified,
                    avatar: user.avatar,
                    licenseNumber: user.licenseNumber,
                    licenseCategory: user.licenseCategory,
                    licenseFrontImage: user.licenseFrontImage,
                    aadhaarNumber: user.aadhaarNumber,
                    panNumber: user.panNumber,
                    panCardImage: user.panCardImage,
                    verificationStatus: user.verificationStatus,
                    verificationNote: user.verificationNote,
                    password: user.password,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    deletedAt: user.deletedAt,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    public async signin(data: SigninDto): Promise<AuthResponseDto> {
        try {
            const { phone, otp } = data;

            // First verify the OTP
            const expectedOtp = phone.slice(-6);
            if (otp !== expectedOtp) {
                throw new HttpException(
                    'auth.error.invalidOtp',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Check if user exists
            const existingUser = await this.prismaService.user.findUnique({
                where: { phone },
            });

            if (!existingUser) {
                throw new HttpException(
                    'auth.error.userNotRegistered',
                    HttpStatus.NOT_FOUND
                );
            }

            // Get all roles linked to the user
            const userRoles = await this.prismaService.userRole.findMany({
                where: { userId: existingUser.id },
            });

            if (userRoles.length === 0) {
                throw new HttpException(
                    'auth.error.noRolesLinked',
                    HttpStatus.FORBIDDEN
                );
            }

            // Generate tokens for ALL available roles
            const roleTokens: {
                role: Role;
                accessToken: string;
                refreshToken: string;
            }[] = [];

            for (const userRole of userRoles) {
                const accessToken =
                    await this.helperEncryptionService.createAccessToken({
                        userId: existingUser.id,
                        role: userRole.role,
                    });

                const refreshToken =
                    await this.helperEncryptionService.createRefreshToken({
                        userId: existingUser.id,
                        role: userRole.role,
                    });

                roleTokens.push({
                    role: userRole.role,
                    accessToken,
                    refreshToken,
                });
            }

            // Return tokens for all roles (primary role will be the first one)
            const primaryRole = roleTokens[0];

            return {
                accessToken: primaryRole.accessToken,
                refreshToken: primaryRole.refreshToken,
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    userName: existingUser.userName,
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    fullName: existingUser.fullName,
                    city: existingUser.city,
                    dateOfBirth: existingUser.dateOfBirth,
                    phone: existingUser.phone,
                    role: primaryRole.role, // Primary role for backward compatibility
                    isVerified: existingUser.isVerified,
                    avatar: existingUser.avatar,
                    licenseNumber: existingUser.licenseNumber,
                    licenseCategory: existingUser.licenseCategory,
                    licenseFrontImage: existingUser.licenseFrontImage,
                    aadhaarNumber: existingUser.aadhaarNumber,
                    panNumber: existingUser.panNumber,
                    panCardImage: existingUser.panCardImage,
                    verificationStatus: existingUser.verificationStatus,
                    verificationNote: existingUser.verificationNote,
                    password: existingUser.password,
                    createdAt: existingUser.createdAt,
                    updatedAt: existingUser.updatedAt,
                    deletedAt: existingUser.deletedAt,
                },
                // Add all role tokens for the controller to use
                allRoleTokens: roleTokens,
            };
        } catch (error) {
            throw error;
        }
    }

    public async addRole(
        data: AddRoleDto,
        authenticatedUserId: string
    ): Promise<AddRoleResponseDto> {
        try {
            const { userId, ...roleSpecificData } = data;

            // Validate that the userId in payload matches the authenticated user
            if (userId !== authenticatedUserId) {
                throw new HttpException(
                    'You can only add roles to your own account',
                    HttpStatus.FORBIDDEN
                );
            }

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
                include: { roles: true },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Determine role based on the documents provided
            let inferredRole: Role;

            // Check if user has license details (DRIVER role)
            if (
                roleSpecificData.licenseNumber &&
                roleSpecificData.licenseCategory &&
                roleSpecificData.licenseFrontImage &&
                roleSpecificData.dateOfBirth
            ) {
                inferredRole = Role.DRIVER;
            }
            // Check if user has both Aadhaar and PAN details (SELLER role)
            else if (
                roleSpecificData.aadhaarNumber &&
                roleSpecificData.aadhaarCardImage &&
                roleSpecificData.panNumber &&
                roleSpecificData.panCardImage
            ) {
                inferredRole = Role.SELLER;
            }
            // Check if user has only Aadhaar details (BUYER role)
            else if (
                roleSpecificData.aadhaarNumber &&
                roleSpecificData.aadhaarCardImage
            ) {
                inferredRole = Role.BUYER;
            }
            // No valid document combination found
            else {
                throw new HttpException(
                    'Invalid document combination. Please provide:\n' +
                        '- For DRIVER: License number, category, image, and date of birth\n' +
                        '- For SELLER: Both Aadhaar and PAN card details\n' +
                        '- For BUYER: Aadhaar card details only',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Check if user already has this role
            const existingRole = user.roles.find(
                role => role.role === inferredRole
            );
            if (existingRole) {
                throw new HttpException(
                    `User already has ${inferredRole} role`,
                    HttpStatus.CONFLICT
                );
            }

            // Update user with role-specific fields
            const updateData: any = {};

            if (inferredRole === Role.DRIVER) {
                updateData.dateOfBirth = new Date(roleSpecificData.dateOfBirth);
                updateData.licenseNumber = roleSpecificData.licenseNumber;
                updateData.licenseCategory = roleSpecificData.licenseCategory;
                updateData.licenseFrontImage =
                    roleSpecificData.licenseFrontImage;
            } else if (inferredRole === Role.SELLER) {
                updateData.panNumber = roleSpecificData.panNumber;
                updateData.panCardImage = roleSpecificData.panCardImage;
                updateData.aadhaarNumber = roleSpecificData.aadhaarNumber;
                updateData.aadhaarCardImage = roleSpecificData.aadhaarCardImage;
            } else if (inferredRole === Role.BUYER) {
                updateData.aadhaarNumber = roleSpecificData.aadhaarNumber;
                updateData.aadhaarCardImage = roleSpecificData.aadhaarCardImage;
            }

            // Update user with role-specific data
            await this.prismaService.user.update({
                where: { id: user.id },
                data: updateData,
                include: { roles: true },
            });

            // Add the new role to user_roles table
            await this.prismaService.userRole.create({
                data: {
                    userId: user.id,
                    role: inferredRole,
                },
            });

            // Get all user roles after adding the new one
            const allUserRoles = await this.prismaService.userRole.findMany({
                where: { userId: user.id },
            });

            return {
                success: true,
                message: `Role ${inferredRole} added successfully to your account`,
                addedRole: inferredRole,
                availableRoles: allUserRoles.map(ur => ur.role),
            };
        } catch (error) {
            throw error;
        }
    }
}
