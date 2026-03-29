/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';
import { MarketplaceRoute } from 'src/common/request/decorators/request.route-context.decorator';
import { AuthUser } from 'src/common/request/decorators/request.user.decorator';
import { IAuthUser } from 'src/common/request/interfaces/request.interface';
import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import {
    VehiclePostPublicCreateDoc,
    VehiclePostPublicDeleteDoc,
    VehiclePostPublicGetAllDoc,
    VehiclePostPublicGetByIdDoc,
    VehiclePostPublicGetByUserIdDoc,
    VehiclePostPublicUpdateDoc,
    VehiclePostPublicUpdateStatusDoc,
    VehiclePostPublicSaveDoc,
    VehiclePostPublicUnsaveDoc,
    VehiclePostPublicGetSavedDoc,
    VehiclePostPublicGetContactDoc,
    VehiclePostPublicGetSavedStatusDoc,
} from '../docs/vehicle-post.public.doc';
import { VehiclePostCreateDto } from '../dtos/request/vehicle-post.create.request';
import { VehiclePostGetDto } from '../dtos/request/vehicle-post.get.request';
import {
    VehiclePostUpdateDto,
    VehiclePostUpdateStatusDto,
} from '../dtos/request/vehicle-post.update.request';
import {
    VehiclePostCreateResponseDto,
    VehiclePostResponseDto,
    VehiclePostUpdateResponseDto,
    VehiclePostContactResponseDto,
} from '../dtos/response/vehicle-post.response';
import { VehiclePostService } from '../services/vehicle-post.service';

@ApiTags('public.vehiclePost')
@Controller({
    path: '/vehicle-post',
    version: '1',
})
export class VehiclePostPublicController {
    constructor(private readonly vehiclePostService: VehiclePostService) {}

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicCreateDoc()
    @Post()
    public async createPost(
        @AuthUser() { userId }: IAuthUser,
        @Body() payload: VehiclePostCreateDto
    ): Promise<VehiclePostCreateResponseDto> {
        return this.vehiclePostService.create(userId, payload);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicDeleteDoc()
    @Delete(':id')
    public async deletePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string
    ): Promise<ApiGenericResponseDto> {
        return this.vehiclePostService.delete(userId, postId);
    }

    @PublicRoute()
    @VehiclePostPublicGetAllDoc()
    @Get()
    public async getPosts(
        @Query() params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto[]>> {
        return this.vehiclePostService.getAll(params);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicGetByUserIdDoc()
    @Get('user/:userId')
    public async getPostsByUserId(
        @Param('userId') userId: string,
        @Query() params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto[]>> {
        return this.vehiclePostService.getPostsByUserId(userId, params);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicGetSavedDoc()
    @Get('saved/:userId')
    public async getSavedPosts(
        @Param('userId') userId: string,
        @Query() params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto>> {
        return this.vehiclePostService.getSavedPosts(userId, params);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicGetContactDoc()
    @Get(':id/contact')
    public async getContactInfo(
        @Param('id') postId: string
    ): Promise<VehiclePostContactResponseDto> {
        return this.vehiclePostService.getContactInfo(postId);
    }

    @PublicRoute()
    @VehiclePostPublicGetByIdDoc()
    @Get(':id')
    public async getPost(
        @Param('id') postId: string
    ): Promise<VehiclePostResponseDto> {
        return this.vehiclePostService.getById(postId);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicGetSavedStatusDoc()
    @Get(':id/saved-status')
    public async getSavedStatus(
        @Param('id') postId: string,
        @AuthUser() user: IAuthUser
    ): Promise<{ isSaved: boolean }> {
        const isSaved = await this.vehiclePostService.checkIfSaved(
            postId,
            user.userId
        );
        return { isSaved };
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicUpdateDoc()
    @Put(':id')
    public async updatePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string,
        @Body() payload: VehiclePostUpdateDto
    ): Promise<VehiclePostUpdateResponseDto> {
        return this.vehiclePostService.update(userId, postId, payload);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicUpdateStatusDoc()
    @Put(':id/status')
    public async updateStatus(
        @Param('id') postId: string,
        @Body() payload: VehiclePostUpdateStatusDto
    ) {
        return this.vehiclePostService.updateStatus(postId, payload.status);
    }

    // Save/Bookmark functionality
    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicSaveDoc()
    @Post(':id/save')
    public async savePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string
    ): Promise<ApiGenericResponseDto> {
        return this.vehiclePostService.savePost(userId, postId);
    }

    @ApiCookieAuth('buyerAccess')
    @ApiCookieAuth('sellerAccess')
    @MarketplaceRoute()
    @VehiclePostPublicUnsaveDoc()
    @Delete(':id/unsave')
    public async unsavePost(
        @AuthUser() { userId }: IAuthUser,
        @Param('id') postId: string
    ): Promise<ApiGenericResponseDto> {
        return this.vehiclePostService.unsavePost(userId, postId);
    }
}
