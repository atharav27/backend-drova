import { PartialType } from '@nestjs/mapped-types';
import { VehiclePostStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { VehiclePostCreateDto } from './vehicle-post.create.request';

export class VehiclePostUpdateDto extends PartialType(VehiclePostCreateDto) {}

export class VehiclePostUpdateStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(VehiclePostStatus)
    status: VehiclePostStatus;
}
