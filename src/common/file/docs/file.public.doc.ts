import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { DocErrors } from 'src/common/doc/decorators/doc.errors.decorator';
import { DocResponse } from 'src/common/doc/decorators/doc.response.decorator';

import { FilePutPresignResponseDto } from '../dtos/file.response.dto';

export function FilePublicPresignUrlDoc() {
    return applyDecorators(
        ApiBearerAuth('accessToken'),
        ApiOperation({
            summary: 'Get pre-signed URL for file upload',
            description: `
                Get a pre-signed URL for uploading files to S3. Files are organized as follows:

                **Bucket Organization:**
                - user-profiles → 'user-profiles' bucket: user-profiles/timestamp_filename
                - vehicle-posts → 'vehicle-posts' bucket: vehicle-posts/timestamp_filename
                - aadhar-card → 'documents' bucket: aadhar-card/timestamp_filename
                - driving-license → 'documents' bucket: driving-license/timestamp_filename

                **File Path Format:** {storeType}/{timestamp}_{fileName}

                **Available storeTypes:** user-profiles, vehicle-posts, aadhar-card, driving-license
            `,
        }),
        DocResponse({
            serialization: FilePutPresignResponseDto,
            httpStatus: HttpStatus.CREATED,
        }),
        DocErrors([HttpStatus.UNAUTHORIZED, HttpStatus.INTERNAL_SERVER_ERROR])
    );
}
