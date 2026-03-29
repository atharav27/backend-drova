/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: '+911234567890',
        required: true,
    })
    @IsPhoneNumber()
    @IsNotEmpty()
    public phone: string;

    // Common fields for all roles
    @ApiProperty({
        example: 'John Doe',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    public fullName: string;

    @ApiProperty({
        example: 'Mumbai',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    public city: string;

    // Driver specific fields (all optional, but if provided together they determine DRIVER role)
    @ApiProperty({
        example: '1990-01-01',
        required: false,
        description: 'Required for DRIVER role along with license details',
    })
    @IsOptional()
    @IsDateString()
    public dateOfBirth?: string;

    @ApiProperty({
        example: 'DL1234567890',
        required: false,
        description:
            'Required for DRIVER role along with other license details',
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    public licenseNumber?: string;

    @ApiProperty({
        example: 'LMV',
        required: false,
        description:
            'Required for DRIVER role along with other license details',
    })
    @IsOptional()
    @IsString()
    public licenseCategory?: string;

    @ApiProperty({
        example: 'license_front_image.jpg',
        required: false,
        description:
            'Required for DRIVER role along with other license details',
    })
    @IsOptional()
    @IsString()
    public licenseFrontImage?: string;

    // Buyer/Seller shared fields (Aadhaar) - optional but if provided together they determine BUYER role
    @ApiProperty({
        example: '123456789012',
        required: false,
        description:
            'Required for BUYER role, or for SELLER role along with PAN details',
    })
    @IsOptional()
    @IsString()
    @Length(12, 12)
    public aadhaarNumber?: string;

    @ApiProperty({
        example: 'aadhaar_card_image.jpg',
        required: false,
        description:
            'Required for BUYER role, or for SELLER role along with PAN details',
    })
    @IsOptional()
    @IsString()
    public aadhaarCardImage?: string;

    // Seller specific fields (PAN) - optional but if provided together with Aadhaar they determine SELLER role
    @ApiProperty({
        example: 'ABCDE1234F',
        required: false,
        description: 'Required for SELLER role along with Aadhaar details',
    })
    @IsOptional()
    @IsString()
    @Length(10, 10)
    public panNumber?: string;

    @ApiProperty({
        example: 'pan_card_image.jpg',
        required: false,
        description: 'Required for SELLER role along with Aadhaar details',
    })
    @IsOptional()
    @IsString()
    public panCardImage?: string;
}

export class VerifyOtpDto {
    @ApiProperty({
        example: '+911234567890',
        required: true,
    })
    @IsPhoneNumber()
    @IsNotEmpty()
    public phone: string;

    @ApiProperty({
        example: '567890',
        required: true,
        description: 'OTP (last 6 digits of phone number for testing)',
    })
    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    public otp: string;
}

export class SigninDto extends VerifyOtpDto {
    // Role parameter removed - will be automatically detected from user's available roles
}

export class AddRoleDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
        description: 'The ID of the authenticated user',
    })
    @IsString()
    @IsNotEmpty()
    public userId: string;

    // Driver specific fields (optional, but if provided together they determine DRIVER role)
    @ApiProperty({
        example: '1990-01-01',
        required: false,
        description: 'Required for DRIVER role along with license details',
    })
    @IsOptional()
    @IsDateString()
    public dateOfBirth?: string;

    @ApiProperty({
        example: 'DL1234567890',
        required: false,
        description:
            'Required for DRIVER role along with other license details',
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    public licenseNumber?: string;

    @ApiProperty({
        example: 'LMV',
        required: false,
        description:
            'Required for DRIVER role along with other license details',
    })
    @IsOptional()
    @IsString()
    public licenseCategory?: string;

    @ApiProperty({
        example: 'license_front_image.jpg',
        required: false,
        description:
            'Required for DRIVER role along with other license details',
    })
    @IsOptional()
    @IsString()
    public licenseFrontImage?: string;

    // Buyer/Seller shared fields (Aadhaar) - optional but if provided together they determine BUYER role
    @ApiProperty({
        example: '123456789012',
        required: false,
        description:
            'Required for BUYER role, or for SELLER role along with PAN details',
    })
    @IsOptional()
    @IsString()
    @Length(12, 12)
    public aadhaarNumber?: string;

    @ApiProperty({
        example: 'aadhaar_card_image.jpg',
        required: false,
        description:
            'Required for BUYER role, or for SELLER role along with PAN details',
    })
    @IsOptional()
    @IsString()
    public aadhaarCardImage?: string;

    // Seller specific fields (PAN) - optional but if provided together with Aadhaar they determine SELLER role
    @ApiProperty({
        example: 'ABCDE1234F',
        required: false,
        description: 'Required for SELLER role along with Aadhaar details',
    })
    @IsOptional()
    @IsString()
    @Length(10, 10)
    public panNumber?: string;

    @ApiProperty({
        example: 'pan_card_image.jpg',
        required: false,
        description: 'Required for SELLER role along with Aadhaar details',
    })
    @IsOptional()
    @IsString()
    public panCardImage?: string;
}
