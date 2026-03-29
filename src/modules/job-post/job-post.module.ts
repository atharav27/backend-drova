import { Module } from '@nestjs/common';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';

import { JobPostAdminController } from './controllers/job-post.admin.controller';
import { JobPostPublicController } from './controllers/job-post.public.controller';
import { JobPostService } from './services/job-post.service';

@Module({
    controllers: [JobPostPublicController, JobPostAdminController],
    providers: [JobPostService, PrismaService, HelperPaginationService],
    exports: [JobPostService],
})
export class JobPostModule {}
