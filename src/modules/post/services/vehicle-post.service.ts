import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { VehiclePostStatus } from '@prisma/client';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';
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
import { IVehiclePostService } from '../interfaces/vehicle-post.service.interface';

@Injectable()
export class VehiclePostService implements IVehiclePostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly helperPaginationService: HelperPaginationService
    ) {}

    async create(
        userId: string,
        data: VehiclePostCreateDto
    ): Promise<VehiclePostCreateResponseDto> {
        const {
            vehicleName,
            price,
            vehicleCategory,
            location,
            fuelType,
            kmsDriven,
            seatingCapacity,
            engineDisplacement,
            mileage,
            maxPower,
            description,
            features,
            images,
            contactName,
            contactNumber,
            yearOfManufacture,
            transmission,
            status,
            // removed autoPublish
        } = data;

        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            const created = await this.prismaService.vehiclePost.create({
                data: {
                    postedBy: {
                        connect: { id: userId },
                    },
                    vehicleName,
                    price,
                    vehicleCategory: vehicleCategory as any, // enum
                    location,
                    fuelType: fuelType as any, // enum
                    kmsDriven,
                    seatingCapacity,
                    engineDisplacement,
                    mileage,
                    maxPower,
                    description,
                    features,
                    contactName,
                    contactNumber,
                    yearOfManufacture,
                    transmission: transmission as any, // enum
                    status: status || VehiclePostStatus.DRAFT,
                    images: {
                        create: images.map(key => ({ key })),
                    },
                },
                include: {
                    postedBy: true,
                    images: true,
                },
            });

            // Map images to string[] for response
            return {
                id: created.id,
                vehicleName: created.vehicleName,
                price: created.price,
                vehicleCategory: created.vehicleCategory,
                location: created.location,
                fuelType: created.fuelType,
                kmsDriven: created.kmsDriven,
                seatingCapacity: created.seatingCapacity,
                engineDisplacement: created.engineDisplacement,
                mileage: created.mileage,
                maxPower: created.maxPower,
                description: created.description,
                features: created.features,
                images: created.images.map(img => img.key),
                contactName: created.contactName,
                contactNumber: created.contactNumber,
                yearOfManufacture: created.yearOfManufacture,
                transmission: created.transmission,
                status: created.status,
                approvalNote: created.approvalNote,
                // autoPublish removed from model usage
                userId: created.userId,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt,
                deletedAt: created.deletedAt,
            };
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: string, id: string): Promise<ApiGenericResponseDto> {
        try {
            const post = await this.prismaService.vehiclePost.findUnique({
                where: { id },
                include: { postedBy: true },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            if (post.postedBy.id !== userId) {
                throw new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                );
            }

            await this.prismaService.vehiclePost.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            return {
                success: true,
                message: 'post.success.postDeleted',
            };
        } catch (error) {
            throw error;
        }
    }

    async getAll(
        params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto[]>> {
        const { search, ...paginationParams } = params;

        console.log(search, paginationParams);

        const whereClause = search
            ? {
                  OR: [
                      {
                          vehicleName: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                      {
                          description: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                      {
                          location: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                  ],
              }
            : {};

        return this.helperPaginationService.paginate(
            this.prismaService.vehiclePost,
            paginationParams,
            {
                where: {
                    ...whereClause,
                    deletedAt: null,
                    status: VehiclePostStatus.PUBLISHED,
                },
                include: {
                    images: true,
                    postedBy: true,
                },
                orderBy: { createdAt: 'desc' },
            }
        );
    }

    async getById(
        id: string,
        currentUserId?: string
    ): Promise<VehiclePostResponseDto> {
        try {
            const post = await this.prismaService.vehiclePost.findUnique({
                where: { id },
                include: { images: true, postedBy: true },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Count seller's active listings (published & not soft-deleted)
            const activeListingCount =
                await this.prismaService.vehiclePost.count({
                    where: {
                        userId: post.userId,
                        status: VehiclePostStatus.PUBLISHED,
                        deletedAt: null,
                    },
                });

            // Compute isSaved for current user (if provided)
            const isSaved = currentUserId
                ? !!(await this.prismaService.savedVehiclePost.findFirst({
                      where: {
                          userId: currentUserId,
                          vehiclePostId: id,
                      },
                  }))
                : false;

            return {
                id: post.id,
                vehicleName: post.vehicleName,
                price: post.price,
                vehicleCategory: post.vehicleCategory,
                location: post.location,
                fuelType: post.fuelType,
                kmsDriven: post.kmsDriven,
                seatingCapacity: post.seatingCapacity,
                engineDisplacement: post.engineDisplacement,
                mileage: post.mileage,
                maxPower: post.maxPower,
                description: post.description,
                features: post.features,
                images: post.images.map(img => img.key),
                contactName: post.contactName,
                contactNumber: post.contactNumber,
                yearOfManufacture: post.yearOfManufacture,
                transmission: post.transmission,
                status: post.status,
                approvalNote: post.approvalNote,
                // autoPublish removed from model usage
                userId: post.userId,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                deletedAt: post.deletedAt,
                activeListingCount,
                isSaved,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(
        userId: string,
        id: string,
        data: VehiclePostUpdateDto
    ): Promise<VehiclePostUpdateResponseDto> {
        try {
            const {
                vehicleName,
                price,
                vehicleCategory,
                location,
                fuelType,
                kmsDriven,
                seatingCapacity,
                engineDisplacement,
                mileage,
                maxPower,
                description,
                features,
                images,
                contactName,
                contactNumber,
                yearOfManufacture,
                transmission,
            } = data;
            const post = await this.prismaService.vehiclePost.findUnique({
                where: { id },
                include: { images: true, postedBy: true },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            if (post.postedBy.id !== userId) {
                throw new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                );
            }

            const currentImages = post.images.map(image => image.key);
            const imagesToDelete =
                currentImages.filter(image => !images?.includes(image)) ?? [];
            const imagesToAdd =
                images?.filter(image => !currentImages.includes(image)) ?? [];

            const updated = await this.prismaService.vehiclePost.update({
                where: { id },
                data: {
                    vehicleName,
                    price,
                    vehicleCategory: vehicleCategory as any,
                    location,
                    fuelType: fuelType as any,
                    kmsDriven,
                    seatingCapacity,
                    engineDisplacement,
                    mileage,
                    maxPower,
                    description,
                    features,
                    contactName,
                    contactNumber,
                    yearOfManufacture,
                    transmission: transmission as any,
                    images: {
                        deleteMany: { key: { in: imagesToDelete } },
                        create: imagesToAdd.map(key => ({ key })),
                    },
                },
                include: {
                    images: true,
                    postedBy: true,
                },
            });

            return {
                id: updated.id,
                vehicleName: updated.vehicleName,
                price: updated.price,
                vehicleCategory: updated.vehicleCategory,
                location: updated.location,
                fuelType: updated.fuelType,
                kmsDriven: updated.kmsDriven,
                seatingCapacity: updated.seatingCapacity,
                engineDisplacement: updated.engineDisplacement,
                mileage: updated.mileage,
                maxPower: updated.maxPower,
                description: updated.description,
                features: updated.features,
                images: updated.images.map(img => img.key),
                contactName: updated.contactName,
                contactNumber: updated.contactNumber,
                yearOfManufacture: updated.yearOfManufacture,
                transmission: updated.transmission,
                status: updated.status,
                approvalNote: updated.approvalNote,
                // autoPublish removed from model usage
                userId: updated.userId,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
                deletedAt: updated.deletedAt,
            };
        } catch (error) {
            throw error;
        }
    }

    async getPostsByUserId(
        userId: string,
        params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto[]>> {
        try {
            const { search, ...paginationParams } = params;

            console.log(search, paginationParams);

            const whereClause = {
                postedBy: {
                    id: userId,
                },
                ...(search
                    ? {
                          OR: [
                              {
                                  vehicleName: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                              {
                                  description: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                              {
                                  location: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                          ],
                      }
                    : {}),
            };

            return this.helperPaginationService.paginate(
                this.prismaService.vehiclePost,
                paginationParams,
                {
                    where: { ...whereClause, deletedAt: null },
                    include: {
                        images: true,
                        postedBy: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(
        postId: string,
        status: VehiclePostStatus,
        approvalNote?: string | null
    ) {
        const post = await this.prismaService.vehiclePost.findUnique({
            where: { id: postId },
        });

        if (!post || post.deletedAt) {
            throw new HttpException(
                'post.error.postNotFound',
                HttpStatus.NOT_FOUND
            );
        }

        // Allow only DRAFT, PUBLISHED, SOLD
        const allowedStatuses = [
            VehiclePostStatus.DRAFT,
            VehiclePostStatus.PUBLISHED,
            VehiclePostStatus.SOLD,
        ];
        if (!allowedStatuses.includes(status)) {
            throw new HttpException(
                'post.error.invalidStatus',
                HttpStatus.BAD_REQUEST
            );
        }

        // Enforce valid transitions
        const validTransitions: Record<VehiclePostStatus, VehiclePostStatus[]> =
            {
                [VehiclePostStatus.DRAFT]: [VehiclePostStatus.PUBLISHED],
                [VehiclePostStatus.PUBLISHED]: [
                    VehiclePostStatus.DRAFT,
                    VehiclePostStatus.SOLD,
                ],
                [VehiclePostStatus.SOLD]: [],
            } as any;

        const from = post.status as VehiclePostStatus;
        if (!validTransitions[from]?.includes(status)) {
            throw new HttpException(
                'post.error.invalidStatusTransition',
                HttpStatus.BAD_REQUEST
            );
        }

        const updatedPost = await this.prismaService.vehiclePost.update({
            where: { id: postId },
            data: {
                status,
                approvalNote:
                    status === VehiclePostStatus.SOLD
                        ? (approvalNote ?? null)
                        : null,
            },
        });

        return updatedPost;
    }

    async approvePost(postId: string) {
        const post = await this.prismaService.vehiclePost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new HttpException(
                'post.error.postNotFound',
                HttpStatus.NOT_FOUND
            );
        }

        const updatedPost = await this.prismaService.vehiclePost.update({
            where: { id: postId },
            data: {
                status: VehiclePostStatus.PUBLISHED,
                approvalNote: null,
            },
        });

        return updatedPost;
    }

    async rejectPost(postId: string, note: string) {
        const post = await this.prismaService.vehiclePost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new HttpException(
                'post.error.postNotFound',
                HttpStatus.NOT_FOUND
            );
        }

        const updatedPost = await this.prismaService.vehiclePost.update({
            where: { id: postId },
            data: {
                status: VehiclePostStatus.DRAFT,
                approvalNote: note,
            },
        });

        return updatedPost;
    }

    // Save/Bookmark functionality
    async savePost(
        userId: string,
        postId: string
    ): Promise<ApiGenericResponseDto> {
        try {
            // Check if post exists
            const post = await this.prismaService.vehiclePost.findUnique({
                where: { id: postId },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Check if already saved
            const existingSave = await this.prismaService.user.findFirst({
                where: {
                    id: userId,
                    savedVehiclePosts: {
                        some: { vehiclePostId: postId },
                    },
                },
            });

            if (existingSave) {
                throw new HttpException(
                    'post.error.postAlreadySaved',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Save the post
            await this.prismaService.savedVehiclePost.create({
                data: {
                    userId,
                    vehiclePostId: postId,
                },
            });

            return {
                success: true,
                message: 'post.success.postSaved',
            };
        } catch (error) {
            throw error;
        }
    }

    async unsavePost(
        userId: string,
        postId: string
    ): Promise<ApiGenericResponseDto> {
        try {
            // Check if post exists
            const post = await this.prismaService.vehiclePost.findUnique({
                where: { id: postId },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            // Check if post is actually saved
            const existingSave = await this.prismaService.user.findFirst({
                where: {
                    id: userId,
                    savedVehiclePosts: {
                        some: { vehiclePostId: postId },
                    },
                },
            });

            if (!existingSave) {
                throw new HttpException(
                    'post.error.postNotSaved',
                    HttpStatus.BAD_REQUEST
                );
            }

            // Unsave the post
            await this.prismaService.savedVehiclePost.deleteMany({
                where: {
                    userId,
                    vehiclePostId: postId,
                },
            });

            return {
                success: true,
                message: 'post.success.postUnsaved',
            };
        } catch (error) {
            throw error;
        }
    }

    async getSavedPosts(
        userId: string,
        params: VehiclePostGetDto
    ): Promise<ApiPaginatedDataDto<VehiclePostResponseDto>> {
        try {
            const { search, ...paginationParams } = params;

            // Check if user exists
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                throw new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            const whereClause = {
                savedBy: {
                    some: { userId: userId },
                },
                deletedAt: null,
                ...(search
                    ? {
                          OR: [
                              {
                                  vehicleName: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                              {
                                  description: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                              {
                                  location: {
                                      contains: search,
                                      mode: 'insensitive',
                                  },
                              },
                          ],
                      }
                    : {}),
            };

            const result = await this.helperPaginationService.paginate(
                this.prismaService.vehiclePost,
                paginationParams,
                {
                    where: whereClause,
                    include: {
                        images: true,
                        postedBy: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            );

            // Map to response DTOs and add isSaved field
            const mappedItems = (result.items as any[]).map(
                (post: any): VehiclePostResponseDto => ({
                    id: post.id,
                    vehicleName: post.vehicleName,
                    price: post.price,
                    vehicleCategory: post.vehicleCategory,
                    location: post.location,
                    fuelType: post.fuelType,
                    kmsDriven: post.kmsDriven,
                    seatingCapacity: post.seatingCapacity,
                    engineDisplacement: post.engineDisplacement,
                    mileage: post.mileage,
                    maxPower: post.maxPower,
                    description: post.description,
                    features: post.features,
                    images: post.images.map((img: any) => img.key),
                    contactName: post.contactName,
                    contactNumber: post.contactNumber,
                    userId: post.userId,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    deletedAt: post.deletedAt,
                    yearOfManufacture: post.yearOfManufacture,
                    transmission: post.transmission,
                    status: post.status,
                    approvalNote: post.approvalNote,
                    // autoPublish removed from model usage
                    isSaved: true, // All posts in saved list are saved by definition
                })
            );

            return {
                metadata: result.metadata,
                items: mappedItems,
            };
        } catch (error) {
            throw error;
        }
    }

    async getContactInfo(id: string): Promise<VehiclePostContactResponseDto> {
        try {
            const post = await this.prismaService.vehiclePost.findUnique({
                where: {
                    id,
                    deletedAt: null,
                    status: VehiclePostStatus.PUBLISHED,
                },
                select: {
                    contactName: true,
                    contactNumber: true,
                },
            });

            if (!post) {
                throw new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                );
            }

            return {
                contactName: post.contactName,
                contactNumber: post.contactNumber,
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                'Failed to fetch contact information',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async checkIfSaved(postId: string, userId: string): Promise<boolean> {
        try {
            const savedRecord =
                await this.prismaService.savedVehiclePost.findFirst({
                    where: {
                        userId,
                        vehiclePostId: postId,
                    },
                });

            return !!savedRecord;
        } catch (error) {
            throw new HttpException(
                'Failed to check saved status',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
