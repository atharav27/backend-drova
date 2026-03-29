/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    IsBoolean,
    IsInt,
} from 'class-validator';

export class UserResponseDto implements Partial<User> {
    @ApiProperty({
        example: faker.string.uuid(),
    })
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: faker.internet.email(),
    })
    @Expose()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    firstName: string | null;

    @ApiProperty({
        example: faker.person.lastName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    lastName: string | null;

    @ApiProperty({
        example: faker.image.avatar(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    avatar: string | null;

    @ApiProperty({
        example: faker.internet.userName(),
    })
    @Expose()
    @IsString()
    userName: string;

    @ApiProperty({
        example: faker.phone.number(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    phone: string | null;

    @ApiProperty({
        enum: $Enums.Role,
        example: faker.helpers.arrayElement(Object.values($Enums.Role)),
    })
    @Expose()
    @IsEnum($Enums.Role)
    role: $Enums.Role;

    @ApiProperty({
        example: faker.datatype.boolean(),
    })
    @Expose()
    @IsBoolean()
    isVerified: boolean;

    @ApiProperty({
        example: faker.person.fullName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    fullName: string | null;

    @ApiProperty({
        example: faker.location.city(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    city: string | null;

    @ApiProperty({
        example: faker.date.past().toISOString(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsDate()
    @IsOptional()
    dateOfBirth: Date | null;

    @ApiProperty({
        example: 'DL1234567890',
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseNumber: string | null;

    @ApiProperty({
        example: 'LMV',
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseCategory: string | null;

    @ApiProperty({
        example: 'license_front_image.jpg',
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseFrontImage: string | null;

    @ApiProperty({
        example: '123456789012',
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    aadhaarNumber: string | null;

    @ApiProperty({
        example: 'ABCDE1234F',
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    panNumber: string | null;

    @ApiProperty({
        example: 'pan_card_image.jpg',
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    panCardImage: string | null;

    @ApiProperty({
        enum: $Enums.VerificationStatus,
        example: faker.helpers.arrayElement(
            Object.values($Enums.VerificationStatus)
        ),
        description: 'Document verification status for drivers and sellers',
    })
    @Expose()
    @IsEnum($Enums.VerificationStatus)
    verificationStatus: $Enums.VerificationStatus;

    @ApiProperty({
        example: 'License image is not clear. Please upload a clearer image.',
        required: false,
        nullable: true,
        description: 'Admin note when verification is rejected',
    })
    @Expose()
    @IsString()
    @IsOptional()
    verificationNote: string | null;

    @ApiProperty({
        example: faker.date.past().toISOString(),
    })
    @Expose()
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: faker.date.recent().toISOString(),
    })
    @Expose()
    @IsDate()
    updatedAt: Date;

    @ApiProperty({
        example: faker.date.future().toISOString(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsDate()
    @IsOptional()
    deletedAt: Date | null;

    @ApiHideProperty()
    @Exclude()
    @IsOptional()
    password?: string | null;
}

export class UserGetProfileResponseDto extends UserResponseDto {}

export class UserUpdateProfileResponseDto extends UserResponseDto {}

// Base Profile DTO with common fields
export class UserDocumentsDto {
    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    aadhaarNumber?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    aadhaarCardImage?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    panNumber?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    panCardImage?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    licenseNumber?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    licenseCategory?: string | null;

    @ApiProperty({ required: false, nullable: true })
    @Expose()
    @IsOptional()
    @IsString()
    licenseFrontImage?: string | null;
}

export class UserBaseProfileDto {
    @ApiProperty({
        example: faker.string.uuid(),
    })
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: faker.internet.email(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsEmail()
    @IsOptional()
    email: string | null;

    @ApiProperty({
        example: faker.internet.userName(),
    })
    @Expose()
    @IsString()
    userName: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    firstName: string | null;

    @ApiProperty({
        example: faker.person.lastName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    lastName: string | null;

    @ApiProperty({
        example: faker.person.fullName(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    fullName: string | null;

    @ApiProperty({
        example: faker.phone.number(),
    })
    @Expose()
    @IsString()
    phone: string;

    @ApiProperty({
        example: faker.location.city(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    city: string | null;

    @ApiProperty({
        type: [String],
        enum: $Enums.Role,
        example: ['BUYER', 'SELLER'],
        description: 'All roles available to this user',
    })
    @Expose()
    @IsEnum($Enums.Role, { each: true })
    role: $Enums.Role[];

    @ApiProperty({
        example: faker.datatype.boolean(),
    })
    @Expose()
    @IsBoolean()
    isVerified: boolean;

    @ApiProperty({
        enum: $Enums.VerificationStatus,
        example: faker.helpers.arrayElement(
            Object.values($Enums.VerificationStatus)
        ),
        description: 'Document verification status',
    })
    @Expose()
    @IsEnum($Enums.VerificationStatus)
    verificationStatus: $Enums.VerificationStatus;

    @ApiProperty({
        example: 'License image is not clear. Please upload a clearer image.',
        required: false,
        nullable: true,
        description: 'Admin note when verification is rejected',
    })
    @Expose()
    @IsString()
    @IsOptional()
    verificationNote: string | null;

    @ApiProperty({
        example: faker.image.avatar(),
        required: false,
        nullable: true,
    })
    @Expose()
    @IsString()
    @IsOptional()
    avatar: string | null;

    @ApiProperty({ required: false, type: () => UserDocumentsDto })
    @Expose()
    @IsOptional()
    documents?: UserDocumentsDto;

    @ApiProperty({
        example: 5,
        description:
            'Number of active (published, not deleted) listings by this user',
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsInt()
    activeListingCount?: number;

    @ApiProperty({
        example: faker.date.past().toISOString(),
    })
    @Expose()
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: faker.date.recent().toISOString(),
    })
    @Expose()
    @IsDate()
    updatedAt: Date;
}

// Buyer Profile DTO (only basic info)
export class UserBuyerProfileDto extends UserBaseProfileDto {
    @ApiProperty({
        type: [String],
        enum: $Enums.Role,
        example: ['BUYER'],
        description: 'User roles - always includes BUYER for this profile type',
    })
    @Expose()
    @IsEnum($Enums.Role, { each: true })
    role: $Enums.Role[];
}

// Driver Profile DTO (includes license info)
export class UserDriverProfileDto extends UserBaseProfileDto {
    @ApiProperty({
        type: [String],
        enum: $Enums.Role,
        example: ['DRIVER'],
        description:
            'User roles - always includes DRIVER for this profile type',
    })
    @Expose()
    @IsEnum($Enums.Role, { each: true })
    role: $Enums.Role[];

    @ApiProperty({
        example: faker.date.past().toISOString(),
        required: false,
        nullable: true,
        description: 'Driver date of birth',
    })
    @Expose()
    @IsDate()
    @IsOptional()
    dateOfBirth: Date | null;

    @ApiProperty({
        example: 'DL1234567890',
        required: false,
        nullable: true,
        description: 'Driver license number',
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseNumber: string | null;

    @ApiProperty({
        example: 'LMV',
        required: false,
        nullable: true,
        description: 'License category (LMV, HMV, etc.)',
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseCategory: string | null;

    @ApiProperty({
        example: 'license_front_image.jpg',
        required: false,
        nullable: true,
        description: 'Front side of license image',
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseFrontImage: string | null;
}

// Seller Profile DTO (includes business info)
export class UserSellerProfileDto extends UserBaseProfileDto {
    @ApiProperty({
        type: [String],
        enum: $Enums.Role,
        example: ['SELLER'],
        description:
            'User roles - always includes SELLER for this profile type',
    })
    @Expose()
    @IsEnum($Enums.Role, { each: true })
    role: $Enums.Role[];

    @ApiProperty({
        example: '123456789012',
        required: false,
        nullable: true,
        description: 'Aadhaar number for verification',
    })
    @Expose()
    @IsString()
    @IsOptional()
    aadhaarNumber: string | null;

    @ApiProperty({
        example: 'ABCDE1234F',
        required: false,
        nullable: true,
        description: 'PAN card number for business verification',
    })
    @Expose()
    @IsString()
    @IsOptional()
    panNumber: string | null;

    @ApiProperty({
        example: 'pan_card_image.jpg',
        required: false,
        nullable: true,
        description: 'PAN card image for verification',
    })
    @Expose()
    @IsString()
    @IsOptional()
    panCardImage: string | null;
}

// Union type for all profile responses
export type UserProfileResponseDto =
    | UserBuyerProfileDto
    | UserDriverProfileDto
    | UserSellerProfileDto;
