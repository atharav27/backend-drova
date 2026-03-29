import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';
import { ApiPaginatedDataDto } from 'src/common/response/dtos/response.paginated.dto';

import { VehiclePostCreateDto } from '../dtos/request/vehicle-post.create.request';
import { VehiclePostGetDto } from '../dtos/request/vehicle-post.get.request';
import { VehiclePostUpdateDto } from '../dtos/request/vehicle-post.update.request';
import {
    VehiclePostCreateResponseDto,
    VehiclePostResponseDto,
    VehiclePostUpdateResponseDto,
    VehiclePostContactResponseDto,
} from '../dtos/response/vehicle-post.response';

export interface IVehiclePostService {
    create(
        userId: string,
        data: VehiclePostCreateDto
    ): Promise<VehiclePostCreateResponseDto>;
    delete(userId: string, id: string): Promise<ApiGenericResponseDto>;
    getAll(
        params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto[]>>;
    getById(
        id: string,
        currentUserId?: string
    ): Promise<VehiclePostResponseDto>;
    getPostsByUserId(
        userId: string,
        params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto[]>>;
    update(
        userId: string,
        id: string,
        data: VehiclePostUpdateDto
    ): Promise<VehiclePostUpdateResponseDto>;

    // Save/Bookmark functionality
    savePost(userId: string, postId: string): Promise<ApiGenericResponseDto>;
    unsavePost(userId: string, postId: string): Promise<ApiGenericResponseDto>;
    getSavedPosts(
        userId: string,
        params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto>>;

    // Contact information
    getContactInfo(id: string): Promise<VehiclePostContactResponseDto>;

    // Saved status check
    checkIfSaved(postId: string, userId: string): Promise<boolean>;
}
