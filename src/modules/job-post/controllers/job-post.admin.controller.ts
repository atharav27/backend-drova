/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role, ApplicationStatus } from '@prisma/client';

import { AllowedRoles } from 'src/common/request/decorators/request.role.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    JobPostAdminCreateDoc,
    JobPostAdminListDoc,
    JobPostAdminGetDoc,
    JobPostAdminUpdateDoc,
    JobPostAdminDeleteDoc,
    JobPostAdminApplicationsDoc,
    JobPostAdminUpdateApplicationStatusDoc,
    JobPostAdminAnalyticsDoc,
} from '../docs/job-post.admin.doc';
import { JobPostCreateRequestDto } from '../dtos/request/job-post.create.request';
import { JobPostGetRequestDto } from '../dtos/request/job-post.get.request';
import { JobPostUpdateRequestDto } from '../dtos/request/job-post.update.request';
import { JobPostResponseDto } from '../dtos/response/job-post.response';
import { JobPostService } from '../services/job-post.service';

@ApiTags('Job Posts - Admin')
@Controller({
    version: '1',
    path: '/admin/job-posts',
})
export class JobPostAdminController {
    constructor(private readonly jobPostService: JobPostService) {}

    @JobPostAdminCreateDoc()
    @Post()
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.CREATED)
    async create(
        @AuthUser() user: IAuthUser,
        @Body() createJobPostDto: JobPostCreateRequestDto
    ): Promise<JobPostResponseDto> {
        return this.jobPostService.create(user.userId, createJobPostDto);
    }

    @JobPostAdminListDoc()
    @Get()
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query() query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>> {
        return this.jobPostService.findAll(query);
    }

    @JobPostAdminGetDoc()
    @Get(':id')
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<JobPostResponseDto> {
        return this.jobPostService.findOne(id);
    }

    @JobPostAdminUpdateDoc()
    @Patch(':id')
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateJobPostDto: JobPostUpdateRequestDto
    ): Promise<JobPostResponseDto> {
        return this.jobPostService.update(id, updateJobPostDto);
    }

    @JobPostAdminDeleteDoc()
    @Delete(':id')
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        return this.jobPostService.remove(id);
    }

    @JobPostAdminApplicationsDoc()
    @Get(':id/applications')
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.OK)
    async getJobApplications(
        @Param('id') jobId: string,
        @Query() query: JobPostGetRequestDto
    ): Promise<any> {
        return this.jobPostService.getJobApplications(jobId, query);
    }

    @JobPostAdminUpdateApplicationStatusDoc()
    @Patch('applications/:applicationId/status')
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.OK)
    async updateApplicationStatus(
        @Param('applicationId') applicationId: string,
        @Body() body: { status: ApplicationStatus; statusNote?: string }
    ): Promise<any> {
        return this.jobPostService.updateApplicationStatus(
            applicationId,
            body.status,
            body.statusNote
        );
    }

    @JobPostAdminAnalyticsDoc()
    @Get('analytics/overview')
    @AllowedRoles([Role.ADMIN, Role.DEVELOPER])
    @HttpCode(HttpStatus.OK)
    async getAnalyticsOverview(): Promise<any> {
        return this.jobPostService.getAnalyticsOverview();
    }
}
