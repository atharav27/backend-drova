/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsNumber,
} from 'class-validator';

export class VehiclePostResponseDto {
    @ApiProperty({ example: 'uuid' })
    @IsUUID()
    id: string;

    @ApiProperty({ example: 'Tata Ace' })
    @IsString()
    vehicleName: string;

    @ApiProperty({ example: 450000 })
    @IsInt()
    price: number;

    @ApiProperty({ example: 'HATCHBACK' })
    @IsString()
    vehicleCategory: string;

    @ApiProperty({ example: 'Mumbai' })
    @IsString()
    location: string;

    @ApiProperty({ example: 'PETROL' })
    @IsString()
    fuelType: string;

    @ApiProperty({ example: 45000 })
    @IsInt()
    kmsDriven: number;

    @ApiProperty({ example: 5 })
    @IsInt()
    seatingCapacity: number;

    @ApiProperty({ example: 1197 })
    @IsInt()
    engineDisplacement: number;

    @ApiProperty({ example: 22.5 })
    @IsNumber()
    mileage: number;

    @ApiProperty({ example: 89 })
    @IsInt()
    maxPower: number;

    @ApiProperty({
        example:
            'Describe the condition, features and history of your vehicle...',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: ['Air Conditioning', 'Power Steering'],
        isArray: true,
    })
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    contactName: string;

    @ApiProperty({ example: '9876543210' })
    @IsString()
    contactNumber: string;

    @ApiProperty({ example: 'uuid' })
    @IsUUID()
    userId?: string;

    @ApiProperty({ example: new Date().toISOString() })
    @IsDate()
    @Type(() => Date)
    createdAt?: Date;

    @ApiProperty({ example: new Date().toISOString() })
    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    @ApiProperty({
        example: new Date().toISOString(),
        required: false,
        nullable: true,
    })
    @IsDate()
    @Type(() => Date)
    deletedAt?: Date;

    @ApiProperty({ example: 2020 })
    @IsInt()
    yearOfManufacture: number;

    @ApiProperty({ example: 'MANUAL' })
    @IsString()
    transmission: string;

    @ApiProperty({ example: 'DRAFT' })
    @IsString()
    status: string;

    @ApiProperty({ example: null, required: false, nullable: true })
    @IsOptional()
    @IsString()
    approvalNote?: string | null;

    // autoPublish removed

    @ApiProperty({
        example: false,
        description: 'Whether the current user has saved/bookmarked this post',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    isSaved?: boolean;

    @ApiProperty({
        example: 3,
        required: false,
        description:
            'Number of active (published, not deleted) listings created by the post owner',
    })
    @IsOptional()
    @IsInt()
    activeListingCount?: number;
}

export class VehiclePostContactResponseDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    contactName: string;

    @ApiProperty({ example: '9876543210' })
    @IsString()
    @IsNotEmpty()
    contactNumber: string;
}

export class VehiclePostCreateResponseDto extends VehiclePostResponseDto {}
export class VehiclePostUpdateResponseDto extends VehiclePostResponseDto {}
