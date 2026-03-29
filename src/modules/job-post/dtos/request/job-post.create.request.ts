/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '@prisma/client';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsInt,
    Min,
    Max,
    Length,
} from 'class-validator';

export class JobPostCreateRequestDto {
    @ApiProperty({
        example: 'Delivery Driver Required',
        required: true,
        description: 'Job title',
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    public title: string;

    @ApiProperty({
        example:
            'We are looking for a reliable delivery driver for our logistics company...',
        required: true,
        description: 'Job description',
    })
    @IsString()
    @IsNotEmpty()
    @Length(10, 2000)
    public description: string;

    @ApiProperty({
        example: 'Swift Logistics Pvt Ltd',
        required: true,
        description: 'Company name',
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    public companyName: string;

    @ApiProperty({
        example: 'Mumbai',
        required: true,
        description: 'Job location',
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    public location: string;

    @ApiProperty({
        example: 'FULL_TIME',
        enum: JobType,
        required: true,
        description: 'Type of job',
    })
    @IsEnum(JobType)
    @IsNotEmpty()
    public jobType: JobType;

    @ApiProperty({
        example: 25000,
        required: false,
        description: 'Minimum salary in INR',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1000000)
    public minSalary?: number;

    @ApiProperty({
        example: 35000,
        required: false,
        description: 'Maximum salary in INR',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1000000)
    public maxSalary?: number;

    @ApiProperty({
        example: 2,
        required: false,
        description: 'Required experience in years',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(50)
    public experience?: number;

    @ApiProperty({
        example: 'Valid driving license, good communication skills, punctual',
        required: false,
        description: 'Job requirements',
    })
    @IsOptional()
    @IsString()
    @Length(0, 1000)
    public requirements?: string;
}
