/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ENUM_FILE_STORE } from '../enums/files.enum';

export class FilePresignDto {
    @ApiProperty({
        example: 'profile-image.jpg',
        required: true,
        description:
            'Name of the file to upload (will be prefixed with timestamp)',
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({
        example: ENUM_FILE_STORE.USER_PROFILES,
        required: true,
        enum: ENUM_FILE_STORE,
        description: `File storage type that determines bucket and folder organization:
        • user-profiles: User profile images (→ user-profiles bucket)
        • vehicle-posts: Vehicle/post images (→ vehicle-posts bucket)
        • aadhar-card: Aadhar card documents (→ documents bucket)
        • driving-license: Driving license documents (→ documents bucket)`,
    })
    @IsEnum(ENUM_FILE_STORE)
    @IsNotEmpty()
    storeType: ENUM_FILE_STORE;

    @ApiProperty({
        example: 'image/jpeg',
        required: true,
        description:
            'MIME type of the file (e.g., image/jpeg, image/png, application/pdf)',
    })
    @IsString()
    @IsNotEmpty()
    contentType: string;
}
