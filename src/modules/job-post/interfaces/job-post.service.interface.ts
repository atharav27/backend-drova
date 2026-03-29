/* eslint-disable prettier/prettier */
import { ApplicationStatus } from '@prisma/client';

import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import { JobApplicationCreateRequestDto } from '../dtos/request/job-application.create.request';
import { JobPostCreateRequestDto } from '../dtos/request/job-post.create.request';
import { JobPostGetRequestDto } from '../dtos/request/job-post.get.request';
import { JobPostUpdateRequestDto } from '../dtos/request/job-post.update.request';
import {
    JobPostResponseDto,
    SavedJobPostResponseDto,
} from '../dtos/response/job-post.response';

export interface IJobPostService {
    // Basic CRUD operations
    create(
        userId: string,
        createJobPostDto: JobPostCreateRequestDto
    ): Promise<JobPostResponseDto>;
    findAll(
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>>;
    findOne(id: string): Promise<JobPostResponseDto>;
    update(
        id: string,
        updateJobPostDto: JobPostUpdateRequestDto
    ): Promise<JobPostResponseDto>;
    remove(id: string): Promise<void>;

    // Public operations
    findAllPublished(
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>>;
    findOnePublished(id: string): Promise<JobPostResponseDto>;

    // User-specific operations
    findByUser(
        userId: string,
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>>;
    updateByUser(
        userId: string,
        id: string,
        updateJobPostDto: JobPostUpdateRequestDto
    ): Promise<JobPostResponseDto>;
    removeByUser(userId: string, id: string): Promise<void>;

    // Save/Unsave operations
    saveJob(userId: string, jobId: string): Promise<ApiGenericResponseDto>;
    unsaveJob(userId: string, jobId: string): Promise<ApiGenericResponseDto>;
    getSavedJobs(
        userId: string,
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<SavedJobPostResponseDto>>;
    checkIfSaved(jobId: string, userId: string): Promise<boolean>;

    // Job applications
    applyToJob(
        userId: string,
        jobId: string,
        applicationData: JobApplicationCreateRequestDto
    ): Promise<any>;
    getMyApplications(
        userId: string,
        query: JobPostGetRequestDto
    ): Promise<any>;
    getJobApplications(
        jobId: string,
        query: JobPostGetRequestDto
    ): Promise<any>;
    getJobApplicationsByUser(
        userId: string,
        jobId: string,
        query: JobPostGetRequestDto
    ): Promise<any>;
    updateApplicationStatus(
        applicationId: string,
        status: ApplicationStatus,
        statusNote?: string
    ): Promise<any>;

    // Analytics
    getAnalyticsOverview(): Promise<any>;
}
