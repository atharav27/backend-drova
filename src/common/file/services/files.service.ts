/* eslint-disable prettier/prettier */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FilePresignDto } from '../dtos/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/file.response.dto';
import { IFilesServiceInterface } from '../interfaces/files.service.interface';

@Injectable()
export class FileService implements IFilesServiceInterface {
    private readonly s3Client: S3Client;
    private readonly expiresIn: number;

    constructor(private readonly configService: ConfigService) {
        // this.s3Client = new S3Client({
        //     credentials: {
        //         accessKeyId: this.configService.get('aws.accessKey') || 'test',
        //         secretAccessKey:
        //             this.configService.get('aws.secretKey') || 'test',
        //     },
        //     region: this.configService.get('aws.region') || 'us-east-1',
        // });
        // this.expiresIn = this.configService.get('aws.s3.linkExpire') || 3600;
        this.s3Client = new S3Client({
            endpoint: 'http://localhost:4566',
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'test',
                secretAccessKey: 'test',
            },
        });
        this.expiresIn = 3600;
    }

    async getPresignUrlPutObject(
        userId: string,
        { fileName, storeType, contentType }: FilePresignDto
    ): Promise<FilePutPresignResponseDto> {
        try {
            let bucket: string;
            let key: string;

            // Route aadhar-card and driving-license to 'documents' bucket with folders
            if (
                storeType === 'aadhar-card' ||
                storeType === 'driving-license'
            ) {
                bucket = 'documents';
                key = `${storeType}/${Date.now()}_${fileName}`;
            } else {
                // user-profiles and vehicle-posts get their own buckets
                bucket = storeType;
                key = `${storeType}/${Date.now()}_${fileName}`;
            }

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: contentType,
            });
            console.log({
                bucket: bucket,
                key: key,
                contentType: contentType,
            });
            const url = await getSignedUrl(this.s3Client, command, {
                expiresIn: this.expiresIn,
            });
            return { url, expiresIn: this.expiresIn };
        } catch (error) {
            throw error;
        }
    }
}
