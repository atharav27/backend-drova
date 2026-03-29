/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';
import { DriverRoute } from 'src/common/request/decorators/request.route-context.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    JobPostPublicCreateDoc,
    JobPostPublicListDoc,
    JobPostPublicGetDoc,
    JobPostPublicUpdateDoc,
    JobPostPublicDeleteDoc,
    JobPostPublicSaveDoc,
    JobPostPublicApplyDoc,
    JobPostPublicMyPostsDoc,
    JobPostPublicUnsaveDoc,
    JobPostPublicGetUserSavedJobsDoc,
    JobPostPublicMyApplicationsDoc,
    JobPostPublicJobApplicationsDoc,
    JobPostPublicGetSavedStatusDoc,
} from '../docs/job-post.public.doc';
import { JobApplicationCreateRequestDto } from '../dtos/request/job-application.create.request';
import { JobPostCreateRequestDto } from '../dtos/request/job-post.create.request';
import { JobPostGetRequestDto } from '../dtos/request/job-post.get.request';
import { JobPostUpdateRequestDto } from '../dtos/request/job-post.update.request';
import {
    JobPostResponseDto,
    SavedJobPostResponseDto,
} from '../dtos/response/job-post.response';
import { JobPostService } from '../services/job-post.service';

@ApiTags('Job Posts - Public')
@Controller({
    version: '1',
    path: '/job-posts',
})
export class JobPostPublicController {
    constructor(private readonly jobService: JobPostService) {}

    @ApiCookieAuth('driverAccess')
    @ApiCookieAuth('adminAccess')
    @ApiCookieAuth('developerAccess')
    @DriverRoute()
    @JobPostPublicCreateDoc()
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @AuthUser() user: IAuthUser,
        @Body() createJobPostDto: JobPostCreateRequestDto
    ): Promise<JobPostResponseDto> {
        return this.jobService.create(user.userId, createJobPostDto);
    }

    @JobPostPublicListDoc()
    @Get()
    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query() query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>> {
        return this.jobService.findAllPublished(query);
    }

    @ApiCookieAuth('driverAccess')
    @ApiCookieAuth('adminAccess')
    @ApiCookieAuth('developerAccess')
    @DriverRoute()
    @JobPostPublicMyPostsDoc()
    @Get('my/posts')
    @HttpCode(HttpStatus.OK)
    async findMyPosts(
        @AuthUser() user: IAuthUser,
        @Query() query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<JobPostResponseDto>> {
        return this.jobService.findByUser(user.userId, query);
    }

    @JobPostPublicGetDoc()
    @Get(':id')
    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<JobPostResponseDto> {
        return this.jobService.findOnePublished(id);
    }

    @ApiCookieAuth('driverAccess')
    @ApiCookieAuth('adminAccess')
    @ApiCookieAuth('developerAccess')
    @DriverRoute()
    @JobPostPublicUpdateDoc()
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @AuthUser() user: IAuthUser,
        @Param('id') id: string,
        @Body() updateJobPostDto: JobPostUpdateRequestDto
    ): Promise<JobPostResponseDto> {
        return this.jobService.updateByUser(user.userId, id, updateJobPostDto);
    }

    @ApiCookieAuth('driverAccess')
    @ApiCookieAuth('adminAccess')
    @ApiCookieAuth('developerAccess')
    @DriverRoute()
    @JobPostPublicDeleteDoc()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@AuthUser() user: IAuthUser, @Param('id') id: string) {
        return this.jobService.removeByUser(user.userId, id);
    }

    @ApiCookieAuth('driverAccess')
    @DriverRoute()
    @JobPostPublicSaveDoc()
    @Post(':id/save')
    @HttpCode(HttpStatus.CREATED)
    async saveJob(
        @AuthUser() user: IAuthUser,
        @Param('id') jobId: string
    ): Promise<ApiGenericResponseDto> {
        return this.jobService.saveJob(user.userId, jobId);
    }

    @ApiCookieAuth('driverAccess')
    @DriverRoute()
    @JobPostPublicUnsaveDoc()
    @Delete(':id/unsave')
    @HttpCode(HttpStatus.OK)
    async unsaveJob(
        @AuthUser() user: IAuthUser,
        @Param('id') jobId: string
    ): Promise<ApiGenericResponseDto> {
        return this.jobService.unsaveJob(user.userId, jobId);
    }

    @ApiCookieAuth('driverAccess')
    @DriverRoute()
    @JobPostPublicMyApplicationsDoc()
    @Get('my/applications')
    @HttpCode(HttpStatus.OK)
    async getMyApplications(
        @AuthUser() user: IAuthUser,
        @Query() query: JobPostGetRequestDto
    ): Promise<any> {
        return this.jobService.getMyApplications(user.userId, query);
    }

    @ApiCookieAuth('driverAccess')
    @DriverRoute()
    @JobPostPublicGetUserSavedJobsDoc()
    @Get('saved/:userId')
    @HttpCode(HttpStatus.OK)
    async getUserSavedJobs(
        @Param('userId') userId: string,
        @Query() query: JobPostGetRequestDto
    ): Promise<ApiPaginatedDataDto<SavedJobPostResponseDto>> {
        return this.jobService.getSavedJobs(userId, query);
    }

    @ApiCookieAuth('driverAccess')
    @DriverRoute()
    @JobPostPublicGetSavedStatusDoc()
    @Get(':id/saved-status')
    @HttpCode(HttpStatus.OK)
    async getSavedStatus(
        @Param('id') jobId: string,
        @AuthUser() user: IAuthUser
    ): Promise<{ isSaved: boolean }> {
        const isSaved = await this.jobService.checkIfSaved(jobId, user.userId);
        return { isSaved };
    }

    @ApiCookieAuth('driverAccess')
    @DriverRoute()
    @JobPostPublicApplyDoc()
    @Post(':id/apply')
    @HttpCode(HttpStatus.CREATED)
    async applyToJob(
        @AuthUser() user: IAuthUser,
        @Param('id') jobId: string,
        @Body() applicationData: JobApplicationCreateRequestDto
    ) {
        return this.jobService.applyToJob(user.userId, jobId, applicationData);
    }

    @ApiCookieAuth('driverAccess')
    @ApiCookieAuth('adminAccess')
    @ApiCookieAuth('developerAccess')
    @DriverRoute()
    @JobPostPublicJobApplicationsDoc()
    @Get(':id/applications')
    @HttpCode(HttpStatus.OK)
    async getMyJobApplications(
        @AuthUser() user: IAuthUser,
        @Param('id') jobId: string,
        @Query() query: JobPostGetRequestDto
    ): Promise<any> {
        return this.jobService.getJobApplicationsByUser(
            user.userId,
            jobId,
            query
        );
    }
}
