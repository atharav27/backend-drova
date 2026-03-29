import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
    VehiclePostAdminApproveStatusDoc,
    VehiclePostAdminRejectStatusDoc,
} from '../docs/vehicle-post.public.doc';
import { VehiclePostService } from '../services/vehicle-post.service';

@ApiTags('admin.vehiclePost')
@Controller({
    path: '/admin/vehicle-post',
    version: '1',
})
export class VehiclePostAdminController {
    constructor(private readonly vehiclePostService: VehiclePostService) {}

    @VehiclePostAdminApproveStatusDoc()
    @Put(':id/approve')
    async approvePost(@Param('id') id: string) {
        return this.vehiclePostService.approvePost(id);
    }

    @VehiclePostAdminRejectStatusDoc()
    @Put(':id/reject')
    async rejectPost(@Param('id') id: string, @Body('note') note: string) {
        return this.vehiclePostService.rejectPost(id, note);
    }
}
