/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JobStatus, ApplicationStatus } from '@prisma/client';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';
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
import { IJobPostService } from '../interfaces/job-post.service.interface';

@Injectable()
export class JobPostService implements IJobPostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly helperPaginationService: HelperPaginationService
    ) {}

    async create(
        userId: string,
        createJobPostDto: JobPostCreateRequestDto
    ): Promise<JobPostResponseDto> {
        try {
            const jobPost = await this.prismaService.driverJob.create({
                data: {
                    ...createJobPostDto,
                    createdById: userId,
                    status: JobStatus.OPEN,
                },
                include: {
                    createdBy: true,
                    applications: {
                        include: {
                            user: true,
                        },
                    },
                    savedBy: true,
                },
            });

            return this.mapToResponseDto(jobPost);
        } catch (error) {
            throw new HttpException(
                'Failed to create job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll(
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>> {
        try {
            const { search, ...paginationParams } = query;

            const where: any = {};

            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { companyName: { contains: search, mode: 'insensitive' } },
                ];
            }

            const result = await this.helperPaginationService.paginate(
                this.prismaService.driverJob,
                {
                    page: paginationParams.page || 1,
                    limit: paginationParams.limit || 10,
                },
                {
                    where,
                    include: {
                        createdBy: true,
                        applications: {
                            include: {
                                user: true,
                            },
                        },
                        savedBy: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );

            return {
                ...result,
                items: (result.items as any[]).map(job =>
                    this.mapToResponseDto(job)
                ),
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch job posts',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findOne(id: string): Promise<JobPostResponseDto> {
        try {
            const jobPost = await this.prismaService.driverJob.findUnique({
                where: { id },
                include: {
                    createdBy: true,
                    applications: {
                        include: {
                            user: true,
                        },
                    },
                    savedBy: {
                        include: {
                            driver: true,
                        },
                    },
                },
            });

            if (!jobPost) {
                throw new HttpException(
                    'Job post not found',
                    HttpStatus.NOT_FOUND
                );
            }

            return this.mapToResponseDto(jobPost);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAllPublished(
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>> {
        try {
            const { search, ...paginationParams } = query;

            const where: any = { status: JobStatus.OPEN };

            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { companyName: { contains: search, mode: 'insensitive' } },
                ];
            }

            const result = await this.helperPaginationService.paginate(
                this.prismaService.driverJob,
                {
                    page: paginationParams.page || 1,
                    limit: paginationParams.limit || 10,
                },
                {
                    where,
                    include: {
                        createdBy: true,
                        applications: {
                            include: {
                                user: true,
                            },
                        },
                        savedBy: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );

            return {
                items: result.items.map(job => this.mapToResponseDto(job)),
                metadata: result.metadata,
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch published job posts',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findOnePublished(id: string): Promise<JobPostResponseDto> {
        try {
            const jobPost = await this.prismaService.driverJob.findUnique({
                where: {
                    id,
                    status: JobStatus.OPEN,
                },
                include: {
                    createdBy: true,
                    applications: true,
                    savedBy: true,
                },
            });

            if (!jobPost) {
                throw new HttpException(
                    'Job post not found',
                    HttpStatus.NOT_FOUND
                );
            }

            return this.mapToResponseDto(jobPost);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findByUser(
        userId: string,
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>> {
        const { search, ...paginationParams } = query;
        const where: any = { createdById: userId };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        try {
            const result = await this.helperPaginationService.paginate(
                this.prismaService.driverJob,
                {
                    page: paginationParams.page || 1,
                    limit: paginationParams.limit || 10,
                },
                {
                    where,
                    include: {
                        createdBy: true,
                        applications: {
                            include: {
                                user: true,
                            },
                        },
                        savedBy: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );

            return {
                ...result,
                items: (result.items as any[]).map(job =>
                    this.mapToResponseDto(job)
                ),
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch user job posts',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(
        id: string,
        updateJobPostDto: JobPostUpdateRequestDto
    ): Promise<JobPostResponseDto> {
        try {
            const jobPost = await this.prismaService.driverJob.update({
                where: { id },
                data: updateJobPostDto,
                include: {
                    createdBy: true,
                    applications: {
                        include: {
                            user: true,
                        },
                    },
                    savedBy: true,
                },
            });

            return this.mapToResponseDto(jobPost);
        } catch (error) {
            throw new HttpException(
                'Failed to update job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateByUser(
        userId: string,
        id: string,
        updateJobPostDto: JobPostUpdateRequestDto
    ): Promise<JobPostResponseDto> {
        try {
            const jobPost = await this.prismaService.driverJob.findUnique({
                where: { id },
            });

            if (!jobPost) {
                throw new HttpException(
                    'Job post not found',
                    HttpStatus.NOT_FOUND
                );
            }

            if (jobPost.createdById !== userId) {
                throw new HttpException(
                    'Unauthorized',
                    HttpStatus.UNAUTHORIZED
                );
            }

            return this.update(id, updateJobPostDto);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to update job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.prismaService.driverJob.delete({
                where: { id },
            });
        } catch (error) {
            throw new HttpException(
                'Failed to delete job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async removeByUser(userId: string, id: string): Promise<void> {
        try {
            const jobPost = await this.prismaService.driverJob.findUnique({
                where: { id },
            });

            if (!jobPost) {
                throw new HttpException(
                    'Job post not found',
                    HttpStatus.NOT_FOUND
                );
            }

            if (jobPost.createdById !== userId) {
                throw new HttpException(
                    'Unauthorized',
                    HttpStatus.UNAUTHORIZED
                );
            }

            await this.remove(id);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to delete job post',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async saveJob(
        userId: string,
        jobId: string
    ): Promise<ApiGenericResponseDto> {
        try {
            // Check if job exists
            const job = await this.prismaService.driverJob.findUnique({
                where: { id: jobId },
            });

            if (!job) {
                throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
            }

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Check if already saved
            const existingSave =
                await this.prismaService.savedDriverJob.findUnique({
                    where: {
                        driverId_jobId: {
                            driverId: userId,
                            jobId,
                        },
                    },
                });

            if (existingSave) {
                throw new HttpException(
                    'Job already saved',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Save the job
            await this.prismaService.savedDriverJob.create({
                data: {
                    driverId: userId,
                    jobId,
                },
            });

            return {
                success: true,
                message: 'Job saved successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to save job',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async unsaveJob(
        userId: string,
        jobId: string
    ): Promise<ApiGenericResponseDto> {
        try {
            // Check if job exists
            const job = await this.prismaService.driverJob.findUnique({
                where: { id: jobId },
            });

            if (!job) {
                throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
            }

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Check if job is actually saved
            const existingSave =
                await this.prismaService.savedDriverJob.findUnique({
                    where: {
                        driverId_jobId: {
                            driverId: userId,
                            jobId,
                        },
                    },
                });

            if (!existingSave) {
                throw new HttpException(
                    'Job is not saved',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Unsave the job
            await this.prismaService.savedDriverJob.delete({
                where: {
                    driverId_jobId: {
                        driverId: userId,
                        jobId,
                    },
                },
            });

            return {
                success: true,
                message: 'Job unsaved successfully',
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to unsave job',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getSavedJobs(
        userId: string,
        query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<SavedJobPostResponseDto>> {
        try {
            const { search, ...paginationParams } = query;

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            const where: any = { driverId: userId };

            // Add search filter for the job if search is provided
            if (search) {
                where.job = {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        {
                            description: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            companyName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                };
            }

            const result = await this.helperPaginationService.paginate(
                this.prismaService.savedDriverJob,
                {
                    page: paginationParams.page || 1,
                    limit: paginationParams.limit || 10,
                },
                {
                    where,
                    include: {
                        job: {
                            include: {
                                createdBy: true,
                                applications: true,
                                savedBy: true,
                            },
                        },
                    },
                    orderBy: { savedAt: 'desc' },
                }
            );

            return {
                ...result,
                items: (result.items as any[]).map(
                    savedJob =>
                        ({
                            ...this.mapToResponseDto(savedJob.job),
                            savedAt: savedJob.savedAt,
                            isSaved: true, // All jobs in saved list are saved by definition
                        }) as SavedJobPostResponseDto
                ),
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to fetch saved jobs',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async checkIfSaved(jobId: string, userId: string): Promise<boolean> {
        try {
            const savedJob = await this.prismaService.savedDriverJob.findUnique(
                {
                    where: {
                        driverId_jobId: {
                            driverId: userId,
                            jobId,
                        },
                    },
                }
            );

            return !!savedJob;
        } catch (error) {
            throw new HttpException(
                'Failed to check saved status',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async applyToJob(
        userId: string,
        jobId: string,
        applicationData: JobApplicationCreateRequestDto
    ): Promise<any> {
        try {
            // Check if user already applied to this job
            const existingApplication =
                await this.prismaService.jobApplication.findUnique({
                    where: {
                        userId_jobId: {
                            userId,
                            jobId,
                        },
                    },
                });

            if (existingApplication) {
                throw new HttpException(
                    'You have already applied to this job',
                    HttpStatus.CONFLICT
                );
            }

            // Check if the job exists and is still open
            const job = await this.prismaService.driverJob.findUnique({
                where: { id: jobId },
            });

            if (!job) {
                throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
            }

            if (job.status !== JobStatus.OPEN) {
                throw new HttpException(
                    'This job is no longer accepting applications',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Fetch user's current license info for snapshot
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
                select: {
                    licenseNumber: true,
                    licenseCategory: true,
                },
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Create the application with detailed data
            const application = await this.prismaService.jobApplication.create({
                data: {
                    userId,
                    jobId,
                    status: ApplicationStatus.APPLIED,
                    yearsOfExperience: applicationData.yearsOfExperience,
                    availableFrom: new Date(applicationData.availableFrom),
                    motivation: applicationData.motivation,
                    licenseNumber: user.licenseNumber,
                    licenseCategory: user.licenseCategory,
                },
                include: {
                    job: {
                        include: {
                            createdBy: true,
                        },
                    },
                    user: true,
                },
            });

            return {
                id: application.id,
                status: application.status,
                statusNote: application.statusNote,
                yearsOfExperience: application.yearsOfExperience,
                availableFrom: application.availableFrom,
                motivation: application.motivation,
                licenseNumber: application.licenseNumber, // From application snapshot
                licenseCategory: application.licenseCategory, // From application snapshot
                appliedAt: application.appliedAt,
                job: this.mapToResponseDto(application.job),
                user: {
                    id: application.user.id,
                    fullName: application.user.fullName,
                    userName: application.user.userName,
                    phone: application.user.phone,
                    city: application.user.city,
                    // License info now comes from application record, not user
                },
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to apply to job',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getMyApplications(
        userId: string,
        query: JobPostGetRequestDto
    ): Promise<any> {
        try {
            const { search, ...paginationParams } = query;
            const where: any = { userId };

            // Add search filter for the job if search is provided
            if (search) {
                where.job = {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        {
                            description: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            companyName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                };
            }

            const result = await this.helperPaginationService.paginate(
                this.prismaService.jobApplication,
                {
                    page: paginationParams.page || 1,
                    limit: paginationParams.limit || 10,
                },
                {
                    where,
                    include: {
                        job: {
                            include: {
                                createdBy: true,
                            },
                        },
                    },
                    orderBy: { appliedAt: 'desc' },
                }
            );

            return {
                ...result,
                items: (result.items as any[]).map(app => ({
                    id: app.id,
                    status: app.status,
                    statusNote: app.statusNote,
                    appliedAt: app.appliedAt,
                    job: this.mapToResponseDto(app.job),
                })),
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch applications',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getJobApplications(
        jobId: string,
        query: JobPostGetRequestDto
    ): Promise<any> {
        try {
            const { search, ...paginationParams } = query;
            const where: any = { jobId };

            // Add search filter for user if search is provided
            if (search) {
                where.user = {
                    OR: [
                        { fullName: { contains: search, mode: 'insensitive' } },
                        { userName: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search, mode: 'insensitive' } },
                    ],
                };
            }

            const result = await this.helperPaginationService.paginate(
                this.prismaService.jobApplication,
                {
                    page: paginationParams.page || 1,
                    limit: paginationParams.limit || 10,
                },
                {
                    where,
                    include: {
                        user: true,
                        job: {
                            include: {
                                createdBy: true,
                            },
                        },
                    },
                    orderBy: { appliedAt: 'desc' },
                }
            );

            return {
                ...result,
                items: (result.items as any[]).map(app => ({
                    id: app.id,
                    status: app.status,
                    statusNote: app.statusNote,
                    appliedAt: app.appliedAt,
                    user: {
                        id: app.user.id,
                        fullName: app.user.fullName,
                        userName: app.user.userName,
                        phone: app.user.phone,
                        city: app.user.city,
                        licenseNumber: app.user.licenseNumber,
                        licenseCategory: app.user.licenseCategory,
                        experience: app.user.dateOfBirth
                            ? Math.floor(
                                  (new Date().getTime() -
                                      new Date(
                                          app.user.dateOfBirth
                                      ).getTime()) /
                                      (1000 * 60 * 60 * 24 * 365)
                              )
                            : null,
                    },
                })),
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch job applications',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getJobApplicationsByUser(
        userId: string,
        jobId: string,
        query: JobPostGetRequestDto
    ): Promise<any> {
        try {
            // First verify that the user owns this job
            const job = await this.prismaService.driverJob.findUnique({
                where: { id: jobId },
            });

            if (!job) {
                throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
            }

            if (job.createdById !== userId) {
                throw new HttpException(
                    'Unauthorized',
                    HttpStatus.UNAUTHORIZED
                );
            }

            return this.getJobApplications(jobId, query);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch job applications',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateApplicationStatus(
        applicationId: string,
        status: ApplicationStatus,
        statusNote?: string
    ): Promise<any> {
        try {
            const application = await this.prismaService.jobApplication.update({
                where: { id: applicationId },
                data: {
                    status,
                    statusNote,
                },
                include: {
                    user: true,
                    job: {
                        include: {
                            createdBy: true,
                        },
                    },
                },
            });

            return {
                id: application.id,
                status: application.status,
                statusNote: application.statusNote,
                appliedAt: application.appliedAt,
                user: {
                    id: application.user.id,
                    fullName: application.user.fullName,
                    userName: application.user.userName,
                    phone: application.user.phone,
                    city: application.user.city,
                },
                job: this.mapToResponseDto(application.job),
            };
        } catch (error) {
            throw new HttpException(
                'Failed to update application status',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getAnalyticsOverview(): Promise<any> {
        try {
            const [
                totalJobs,
                openJobs,
                closedJobs,
                totalApplications,
                pendingApplications,
                acceptedApplications,
                rejectedApplications,
            ] = await Promise.all([
                this.prismaService.driverJob.count(),
                this.prismaService.driverJob.count({
                    where: { status: JobStatus.OPEN },
                }),
                this.prismaService.driverJob.count({
                    where: { status: JobStatus.CLOSED },
                }),
                this.prismaService.jobApplication.count(),
                this.prismaService.jobApplication.count({
                    where: { status: ApplicationStatus.APPLIED },
                }),
                this.prismaService.jobApplication.count({
                    where: { status: ApplicationStatus.ACCEPTED },
                }),
                this.prismaService.jobApplication.count({
                    where: { status: ApplicationStatus.REJECTED },
                }),
            ]);

            return {
                jobs: {
                    total: totalJobs,
                    open: openJobs,
                    closed: closedJobs,
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    accepted: acceptedApplications,
                    rejected: rejectedApplications,
                },
            };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch analytics',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private mapToResponseDto(jobPost: any): JobPostResponseDto {
        return {
            id: jobPost.id,
            title: jobPost.title,
            description: jobPost.description,
            companyName: jobPost.companyName,
            location: jobPost.location,
            jobType: jobPost.jobType,
            minSalary: jobPost.minSalary,
            maxSalary: jobPost.maxSalary,
            experience: jobPost.experience,
            requirements: jobPost.requirements,
            status: jobPost.status,
            createdAt: jobPost.createdAt,
            updatedAt: jobPost.updatedAt,
            createdBy: jobPost.createdBy
                ? {
                      id: jobPost.createdBy.id,
                      fullName: jobPost.createdBy.fullName,
                      userName: jobPost.createdBy.userName,
                      phone: jobPost.createdBy.phone,
                      city: jobPost.createdBy.city,
                  }
                : null,
            applicationCount: jobPost.applications?.length || 0,
            savedCount: jobPost.savedBy?.length || 0,
            applications: jobPost.applications?.map((app: any) => ({
                id: app.id,
                userId: app.userId,
                status: app.status,
                statusNote: app.statusNote,
                appliedAt: app.appliedAt,
                user: app.user
                    ? {
                          id: app.user.id,
                          fullName: app.user.fullName,
                          userName: app.user.userName,
                          phone: app.user.phone,
                          city: app.user.city,
                      }
                    : undefined,
            })),
        };
    }
}
