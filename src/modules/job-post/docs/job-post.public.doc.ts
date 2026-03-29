/* eslint-disable prettier/prettier */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiCookieAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocGenericResponse } from 'src/common/doc/decorators/doc.generic.decorator';
import { DocPaginatedResponse } from 'src/common/doc/decorators/doc.paginated.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import { JobApplicationCreateRequestDto } from '../dtos/request/job-application.create.request';
import {
    JobPostResponseDto,
    SavedJobPostResponseDto,
} from '../dtos/response/job-post.response';

export function JobPostPublicCreateDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiCookieAuth('adminAccess'),
        ApiCookieAuth('developerAccess'),
        ApiOperation({
            summary: 'Create new job post',
            description: 'Create a new job posting for drivers',
        }),
        ApiCreatedResponse({
            description: 'Job post created successfully',
            type: JobPostResponseDto,
        }),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostPublicListDoc(): MethodDecorator {
    return applyDecorators(
        ApiOperation({
            summary: 'Get all published job posts',
            description:
                'Retrieve all published job posts with optional filtering',
        }),
        ApiQuery({
            name: 'search',
            required: false,
            description: 'Search in title, description, or company name',
        }),
        ApiQuery({
            name: 'page',
            required: false,
            description: 'Page number for pagination',
            example: 1,
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            description: 'Number of items per page',
            example: 10,
        }),
        DocPaginatedResponse({
            httpStatus: HttpStatus.OK,
            serialization: JobPostResponseDto,
        }),
        DocErrors([HttpStatus.INTERNAL_SERVER_ERROR])
    );
}

export function JobPostPublicGetDoc(): MethodDecorator {
    return applyDecorators(
        ApiOperation({
            summary: 'Get job post by ID',
            description: 'Retrieve a specific published job post by its ID',
        }),
        ApiParam({
            name: 'id',
            description: 'Job post UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiOkResponse({
            description: 'Job post retrieved successfully',
            type: JobPostResponseDto,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR])
    );
}

export function JobPostPublicUpdateDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiCookieAuth('adminAccess'),
        ApiCookieAuth('developerAccess'),
        ApiOperation({
            summary: 'Update own job post',
            description: 'Update a job post created by the authenticated user',
        }),
        ApiParam({
            name: 'id',
            description: 'Job post UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiOkResponse({
            description: 'Job post updated successfully',
            type: JobPostResponseDto,
        }),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.NOT_FOUND,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostPublicDeleteDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiCookieAuth('adminAccess'),
        ApiCookieAuth('developerAccess'),
        ApiOperation({
            summary: 'Delete own job post',
            description: 'Delete a job post created by the authenticated user',
        }),
        ApiParam({
            name: 'id',
            description: 'Job post UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiNoContentResponse({
            description: 'Job post deleted successfully',
        }),
        DocErrors([
            HttpStatus.UNAUTHORIZED,
            HttpStatus.NOT_FOUND,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostPublicSaveDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiOperation({
            summary: 'Save job post',
            description: 'Save a job post to user favorites',
        }),
        ApiParam({
            name: 'id',
            description: 'Job post UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        DocGenericResponse(),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostPublicApplyDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiOperation({
            summary: 'Apply to job with detailed application form',
            description: `Submit a comprehensive job application. This API requires all application data to be provided in the request body, including:

**Required Fields:**
• Full name (must match user profile)
• Contact number (must match user profile)
• License number (must match user profile)
• License category (must match user profile)
• Years of driving experience
• Availability start date
• Motivation/interest in the position

The system validates that profile data matches the user's actual profile for security and creates a complete application record.`,
        }),
        ApiParam({
            name: 'id',
            description:
                'Job post UUID - The specific job you are applying for',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiBody({
            type: JobApplicationCreateRequestDto,
            description: `Application form data that user fills out. All fields are required and will be validated against user profile data for security.`,
            examples: {
                'Sample Application': {
                    value: {
                        fullName: 'John Doe',
                        contactNumber: '+919876543210',
                        licenseNumber: 'MH0123456789',
                        licenseCategory: 'Light Motor Vehicle',
                        yearsOfExperience: 3,
                        availableFrom: '2024-02-01',
                        motivation:
                            'I am very interested in this position because I have extensive experience in logistics and delivery services. I am punctual, reliable, and have excellent knowledge of the city roads. This role aligns perfectly with my career goals in the transportation industry.',
                    },
                },
            },
        }),
        ApiCreatedResponse({
            description:
                'Application submitted successfully. Returns complete application record including both user input and verified profile data.',
            schema: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Application UUID' },
                    status: {
                        type: 'string',
                        enum: ['APPLIED'],
                        description: 'Application status',
                    },
                    yearsOfExperience: {
                        type: 'number',
                        description: 'Years of experience (from form)',
                    },
                    availableFrom: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Availability date (from form)',
                    },
                    motivation: {
                        type: 'string',
                        description: 'User motivation text (from form)',
                    },
                    licenseNumber: {
                        type: 'string',
                        description: 'License number (snapshot from profile)',
                    },
                    licenseCategory: {
                        type: 'string',
                        description: 'License category (snapshot from profile)',
                    },
                    appliedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Application timestamp',
                    },
                    user: {
                        type: 'object',
                        description:
                            'Applicant details (snapshot from profile)',
                        properties: {
                            id: { type: 'string' },
                            fullName: {
                                type: 'string',
                                description: 'Full name (from profile)',
                            },
                            phone: {
                                type: 'string',
                                description: 'Contact number (from profile)',
                            },
                            city: {
                                type: 'string',
                                description: 'City (from profile)',
                            },
                        },
                    },
                    job: {
                        type: 'object',
                        description: 'Job details user applied for',
                    },
                },
            },
        }),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.CONFLICT,
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostPublicMyPostsDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiCookieAuth('adminAccess'),
        ApiCookieAuth('developerAccess'),
        ApiOperation({
            summary: 'Get my job posts',
            description: 'Retrieve job posts created by the authenticated user',
        }),
        DocPaginatedResponse({
            httpStatus: HttpStatus.OK,
            serialization: JobPostResponseDto,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
    );
}

export function JobPostPublicUnsaveDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiOperation({
            summary: 'Unsave job',
            description: 'Remove a job from saved jobs list',
        }),
        ApiParam({
            name: 'id',
            description: 'Job post UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        DocGenericResponse(),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostPublicGetUserSavedJobsDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiOperation({
            summary: "Get user's saved job posts",
            description:
                'Retrieves all job posts that a specific user has saved/bookmarked with pagination and search support',
        }),
        ApiParam({
            name: 'userId',
            description: 'User ID to get saved jobs for',
        }),
        DocPaginatedResponse({
            httpStatus: HttpStatus.OK,
            serialization: SavedJobPostResponseDto,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND])
    );
}

export function JobPostPublicGetSavedStatusDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiOperation({
            summary: 'Check if a job post is saved by the current user',
            description:
                'Returns whether the currently authenticated user has saved the specified job post',
        }),
        ApiParam({ name: 'id', description: 'Job Post ID' }),
        DocResponse({
            serialization: Object,
            httpStatus: HttpStatus.OK,
        }),
        DocErrors([HttpStatus.NOT_FOUND, HttpStatus.UNAUTHORIZED])
    );
}

export function JobPostPublicMyApplicationsDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiOperation({
            summary: 'Get my applications',
            description:
                'Retrieve job applications submitted by the authenticated user',
        }),
        ApiOkResponse({
            description: 'Applications retrieved successfully',
        }),
        DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
    );
}

export function JobPostPublicJobApplicationsDoc(): MethodDecorator {
    return applyDecorators(
        ApiCookieAuth('driverAccess'),
        ApiCookieAuth('adminAccess'),
        ApiCookieAuth('developerAccess'),
        ApiOperation({
            summary: 'Get job applications',
            description:
                'Retrieve applications for a specific job (job creator only)',
        }),
        ApiParam({
            name: 'id',
            description: 'Job post UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiOkResponse({
            description: 'Job applications retrieved successfully',
        }),
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}
