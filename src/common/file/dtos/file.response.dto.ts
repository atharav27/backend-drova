/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class FilePutPresignResponseDto {
    @ApiProperty({
        example:
            'http://localhost:4566/user-profiles/user-profiles/1672531200000_profile.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=test%2F20221104%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221104T140227Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=example-signature',
        required: true,
        nullable: false,
        description:
            'Pre-signed S3 URL for file upload. File path format: {bucket}/{storeType}/{timestamp}_{fileName}',
    })
    url: string;

    @ApiProperty({
        example: 3600,
        required: true,
        nullable: false,
        description: 'URL expiration time in seconds (1 hour)',
    })
    expiresIn: number;
}
