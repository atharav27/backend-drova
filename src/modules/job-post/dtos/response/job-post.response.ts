/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { JobType, JobStatus, ApplicationStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

export class JobCreatedByDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 'John Doe',
    })
    @Expose()
    @IsString()
    @IsOptional()
    fullName: string | null;

    @ApiProperty({
        example: 'johndoe',
    })
    @Expose()
    @IsString()
    userName: string;

    @ApiProperty({
        example: '+911234567890',
    })
    @Expose()
    @IsString()
    phone: string;

    @ApiProperty({
        example: 'Mumbai',
    })
    @Expose()
    @IsString()
    @IsOptional()
    city: string | null;
}

export class JobApplicationDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440002',
    })
    @Expose()
    @IsUUID()
    userId: string;

    @ApiProperty({
        example: 'APPLIED',
        enum: ApplicationStatus,
    })
    @Expose()
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

    @ApiProperty({
        example: 'Application reviewed and shortlisted',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    statusNote: string | null;

    @ApiProperty({
        example: 3,
        required: false,
        description: 'Years of driving experience mentioned in application',
    })
    @Expose()
    @IsInt()
    @IsOptional()
    yearsOfExperience: number | null;

    @ApiProperty({
        example: '2024-02-01T00:00:00.000Z',
        required: false,
        description: 'Date when applicant is available to start',
    })
    @Expose()
    @IsDate()
    @IsOptional()
    availableFrom: Date | null;

    @ApiProperty({
        example: 'I am very interested in this position because...',
        required: false,
        description: 'Why the applicant is interested in this job',
    })
    @Expose()
    @IsString()
    @IsOptional()
    motivation: string | null;

    @ApiProperty({
        example: 'MH0123456789',
        required: false,
        description: 'License number at the time of application',
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseNumber: string | null;

    @ApiProperty({
        example: 'Light Motor Vehicle',
        required: false,
        description: 'License category at the time of application',
    })
    @Expose()
    @IsString()
    @IsOptional()
    licenseCategory: string | null;

    @ApiProperty({
        example: '2024-01-15T10:30:00.000Z',
    })
    @Expose()
    @IsDate()
    appliedAt: Date;

    @ApiProperty({
        type: () => JobCreatedByDto,
        required: false,
    })
    @Expose()
    @Type(() => JobCreatedByDto)
    @ValidateNested()
    @IsOptional()
    user?: JobCreatedByDto;
}

export class JobPostResponseDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @Expose()
    @IsUUID()
    id: string;

    @ApiProperty({
        example: 'Delivery Driver Required',
    })
    @Expose()
    @IsString()
    title: string;

    @ApiProperty({
        example:
            'We are looking for a reliable delivery driver for our logistics company...',
    })
    @Expose()
    @IsString()
    description: string;

    @ApiProperty({
        example: 'Swift Logistics Pvt Ltd',
    })
    @Expose()
    @IsString()
    companyName: string;

    @ApiProperty({
        example: 'Mumbai',
    })
    @Expose()
    @IsString()
    location: string;

    @ApiProperty({
        example: 'FULL_TIME',
        enum: JobType,
    })
    @Expose()
    @IsEnum(JobType)
    jobType: JobType;

    @ApiProperty({
        example: 25000,
        required: false,
    })
    @Expose()
    @IsInt()
    @IsOptional()
    minSalary: number | null;

    @ApiProperty({
        example: 35000,
        required: false,
    })
    @Expose()
    @IsInt()
    @IsOptional()
    maxSalary: number | null;

    @ApiProperty({
        example: 2,
        required: false,
    })
    @Expose()
    @IsInt()
    @IsOptional()
    experience: number | null;

    @ApiProperty({
        example: 'Valid driving license, good communication skills, punctual',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    requirements: string | null;

    @ApiProperty({
        example: 'OPEN',
        enum: JobStatus,
    })
    @Expose()
    @IsEnum(JobStatus)
    status: JobStatus;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
    })
    @Expose()
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
    })
    @Expose()
    @IsDate()
    updatedAt: Date;

    @ApiProperty({
        type: () => JobCreatedByDto,
        required: false,
    })
    @Expose()
    @Type(() => JobCreatedByDto)
    @ValidateNested()
    @IsOptional()
    createdBy: JobCreatedByDto | null;

    @ApiProperty({
        example: 5,
        description: 'Number of applications received',
    })
    @Expose()
    @IsInt()
    applicationCount: number;

    @ApiProperty({
        example: 12,
        description: 'Number of users who saved this job',
    })
    @Expose()
    @IsInt()
    savedCount: number;

    @ApiProperty({
        type: [JobApplicationDto],
        required: false,
        description:
            'Job applications (only visible to job creator and admins)',
    })
    @Expose()
    @Type(() => JobApplicationDto)
    @ValidateNested({ each: true })
    @IsOptional()
    applications?: JobApplicationDto[];

    @ApiProperty({
        example: false,
        description: 'Whether the current user has saved/bookmarked this job',
        required: false,
    })
    @Expose()
    @IsOptional()
    @IsBoolean()
    isSaved?: boolean;
}

export class SavedJobPostResponseDto extends JobPostResponseDto {
    @ApiProperty({
        example: '2024-01-15T10:30:00.000Z',
        description: 'Date when the job was saved by the user',
    })
    @Expose()
    @IsDate()
    savedAt: Date;
}

export class JobPostListResponseDto {
    @ApiProperty({
        type: [JobPostResponseDto],
    })
    @Expose()
    @Type(() => JobPostResponseDto)
    @ValidateNested({ each: true })
    data: JobPostResponseDto[];

    @ApiProperty({
        example: {
            total: 100,
            page: 1,
            limit: 10,
            totalPages: 10,
        },
    })
    @Expose()
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
