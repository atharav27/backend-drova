/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class JobPostGetRequestDto {
    @ApiProperty({
        example: 1,
        required: false,
        description: 'Page number for pagination',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    public page?: number = 1;

    @ApiProperty({
        example: 10,
        required: false,
        description: 'Number of items per page',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    public limit?: number = 10;

    @ApiProperty({
        example: 'delivery driver',
        required: false,
        description: 'Search term for title, description, or company name',
    })
    @IsOptional()
    @IsString()
    public search?: string;
}
