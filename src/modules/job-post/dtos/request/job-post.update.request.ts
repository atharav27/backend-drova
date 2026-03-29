/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { JobType, JobStatus } from '@prisma/client';
import {
    IsEnum,
    IsOptional,
    IsString,
    IsInt,
    Min,
    Max,
    Length,
} from 'class-validator';

export class JobPostUpdateRequestDto {
    @ApiProperty({
        example: 'Senior Delivery Driver Required',
        required: false,
        description: 'Job title',
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    public title?: string;

    @ApiProperty({
        example: 'We are looking for an experienced delivery driver...',
        required: false,
        description: 'Job description',
    })
    @IsOptional()
    @IsString()
    @Length(10, 2000)
    public description?: string;

    @ApiProperty({
        example: 'Swift Logistics Pvt Ltd',
        required: false,
        description: 'Company name',
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    public companyName?: string;

    @ApiProperty({
        example: 'Delhi',
        required: false,
        description: 'Job location',
    })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    public location?: string;

    @ApiProperty({
        example: 'PART_TIME',
        enum: JobType,
        required: false,
        description: 'Type of job',
    })
    @IsOptional()
    @IsEnum(JobType)
    public jobType?: JobType;

    @ApiProperty({
        example: 30000,
        required: false,
        description: 'Minimum salary in INR',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1000000)
    public minSalary?: number;

    @ApiProperty({
        example: 45000,
        required: false,
        description: 'Maximum salary in INR',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1000000)
    public maxSalary?: number;

    @ApiProperty({
        example: 3,
        required: false,
        description: 'Required experience in years',
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(50)
    public experience?: number;

    @ApiProperty({
        example:
            'Valid driving license, 3+ years experience, own vehicle preferred',
        required: false,
        description: 'Job requirements',
    })
    @IsOptional()
    @IsString()
    @Length(0, 1000)
    public requirements?: string;

    @ApiProperty({
        example: 'OPEN',
        enum: JobStatus,
        required: false,
        description: 'Job status',
    })
    @IsOptional()
    @IsEnum(JobStatus)
    public status?: JobStatus;
}
