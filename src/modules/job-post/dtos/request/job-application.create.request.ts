/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsInt,
    IsDateString,
    Min,
    Max,
    Length,
} from 'class-validator';

/**
 * Job Application Form Data
 *
 * This DTO accepts the complete form payload from frontend, including both
 * user-input fields and verified profile fields. The backend will validate
 * that verified fields match the user's profile data for security.
 */
export class JobApplicationCreateRequestDto {
    @ApiProperty({
        example: 'John Doe',
        required: true,
        description: 'Full name (must match profile data for verification)',
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    public fullName: string;

    @ApiProperty({
        example: '+919876543210',
        required: true,
        description:
            'Contact number (must match profile data for verification)',
    })
    @IsNotEmpty()
    @IsString()
    public contactNumber: string;

    @ApiProperty({
        example: 'MH0123456789',
        required: true,
        description:
            'License number (must match profile data for verification)',
    })
    @IsNotEmpty()
    @IsString()
    public licenseNumber: string;

    @ApiProperty({
        example: 'Light Motor Vehicle',
        required: true,
        description:
            'License category (must match profile data for verification)',
    })
    @IsNotEmpty()
    @IsString()
    public licenseCategory: string;

    @ApiProperty({
        example: 3,
        required: true,
        description: 'Years of driving experience',
        minimum: 0,
        maximum: 50,
    })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(0)
    @Max(50)
    public yearsOfExperience: number;

    @ApiProperty({
        example: '2024-02-01',
        required: true,
        description: 'Date when the applicant is available to start work',
        format: 'date',
    })
    @IsNotEmpty()
    @IsDateString()
    public availableFrom: string;

    @ApiProperty({
        example:
            'I am very interested in this position because I have extensive experience in logistics and delivery services. I am punctual, reliable, and have excellent knowledge of the city roads. This role aligns perfectly with my career goals in the transportation industry.',
        required: true,
        description: 'Why the applicant is interested in this job position',
        minLength: 50,
        maxLength: 1000,
    })
    @IsNotEmpty()
    @IsString()
    @Length(50, 1000)
    public motivation: string;
}
