import { Module } from '@nestjs/common';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';

import { VehiclePostAdminController } from './controllers/vehicle-posts.admin.controller';
import { VehiclePostPublicController } from './controllers/vehicle-posts.public.controller';
import { VehiclePostService } from './services/vehicle-post.service';

@Module({
    controllers: [VehiclePostPublicController, VehiclePostAdminController],
    providers: [VehiclePostService, PrismaService, HelperPaginationService],
    exports: [VehiclePostService],
})
export class VehiclePostModule {}
