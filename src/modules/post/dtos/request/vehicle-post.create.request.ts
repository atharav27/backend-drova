/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
    VehicleFuelType,
    VehiclePostStatus,
    VehicleTransmissionType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class VehiclePostCreateDto {
    @ApiProperty({ example: 'Tata Ace' })
    @IsString()
    @IsNotEmpty()
    vehicleName: string;

    @ApiProperty({ example: 450000 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ example: 'HATCHBACK' })
    @IsString()
    @IsNotEmpty()
    vehicleCategory: string;

    @ApiProperty({ example: 'Mumbai' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ example: 'PETROL' })
    @IsString()
    @IsNotEmpty()
    fuelType: string;

    @ApiProperty({ example: 45000 })
    @IsInt()
    @IsNotEmpty()
    kmsDriven: number;

    @ApiProperty({ example: 5 })
    @IsInt()
    @IsNotEmpty()
    seatingCapacity: number;

    @ApiProperty({ example: 1197 })
    @IsInt()
    @IsNotEmpty()
    engineDisplacement: number;

    @ApiProperty({ example: 22.5 })
    @IsNumber()
    @IsNotEmpty()
    mileage: number;

    @ApiProperty({ example: 89 })
    @IsInt()
    @IsNotEmpty()
    maxPower: number;

    @ApiProperty({
        example:
            'Describe the condition, features and history of your vehicle...',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: ['Air Conditioning', 'Power Steering'],
        isArray: true,
    })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    features: string[];

    @ApiProperty({ example: ['image1.jpg', 'image2.jpg'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    images: string[];

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    contactName: string;

    @ApiProperty({ example: '9876543210' })
    @IsString()
    @IsNotEmpty()
    contactNumber: string;

    @ApiProperty({ example: 2020 })
    @IsInt()
    @IsNotEmpty()
    yearOfManufacture: number;

    @ApiProperty({ example: 'MANUAL' })
    @IsString()
    @IsNotEmpty()
    transmission: string;

    @ApiProperty({
        example: 'DRAFT',
        enum: ['DRAFT', 'PUBLISHED', 'SOLD'],
        description: 'Allowed statuses',
    })
    @IsEnum(VehiclePostStatus)
    @IsOptional()
    status?: VehiclePostStatus;
    // autoPublish removed
}
