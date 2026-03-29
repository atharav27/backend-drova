import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { VehicleImage } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class VehiclePostImagesResponseDto implements Partial<VehicleImage> {
    @ApiProperty({
        example: faker.string.uuid(),
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        example: faker.system.filePath(),
    })
    @IsString()
    key: string;

    @ApiProperty({
        example: faker.date.past().toISOString(),
    })
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        example: faker.date.recent().toISOString(),
    })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({
        required: false,
        nullable: true,
        example: faker.date.future().toISOString(),
    })
    @IsDate()
    deletedAt: Date | null;

    @ApiHideProperty()
    @Exclude()
    postId: string;
}
