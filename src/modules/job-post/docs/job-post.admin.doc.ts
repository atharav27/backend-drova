/* eslint-disable prettier/prettier */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocPaginatedResponse } from 'src/common/doc/decorators/doc.paginated.decorator';

import { JobPostResponseDto } from '../dtos/response/job-post.response';

export function JobPostAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Create new job post (Admin)',
            description: 'Admin creates a new job posting',
        }),
        ApiCreatedResponse({
            description: 'Job post created successfully',
            type: JobPostResponseDto,
        }),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostAdminListDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Get all job posts (Admin)',
            description:
                'Admin retrieves all job posts with advanced filtering',
        }),
        DocPaginatedResponse({
            httpStatus: HttpStatus.OK,
            serialization: JobPostResponseDto,
        }),
        DocErrors([
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Get job post by ID (Admin)',
            description: 'Admin retrieves a specific job post by its ID',
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
        DocErrors([
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Update job post (Admin)',
            description: 'Admin updates a job post',
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
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Delete job post (Admin)',
            description: 'Admin permanently deletes a job post',
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
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostAdminApplicationsDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Get job applications (Admin)',
            description: 'Admin retrieves all applications for a specific job',
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

export function JobPostAdminUpdateApplicationStatusDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Update application status (Admin)',
            description: 'Admin updates the status of a job application',
        }),
        ApiParam({
            name: 'applicationId',
            description: 'Application UUID',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        enum: Object.values(ApplicationStatus),
                        description: 'New application status',
                    },
                    statusNote: {
                        type: 'string',
                        description: 'Optional note about the status change',
                    },
                },
                required: ['status'],
            },
        }),
        ApiOkResponse({
            description: 'Application status updated successfully',
        }),
        DocErrors([
            HttpStatus.BAD_REQUEST,
            HttpStatus.NOT_FOUND,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}

export function JobPostAdminAnalyticsDoc(): MethodDecorator {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Get analytics overview (Admin)',
            description: 'Admin retrieves job posts and applications analytics',
        }),
        ApiOkResponse({
            description: 'Analytics data retrieved successfully',
            schema: {
                type: 'object',
                properties: {
                    totalJobs: { type: 'number' },
                    totalApplications: { type: 'number' },
                    jobsByStatus: { type: 'object' },
                    applicationsByStatus: { type: 'object' },
                },
            },
        }),
        DocErrors([
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
            HttpStatus.INTERNAL_SERVER_ERROR,
        ])
    );
}
