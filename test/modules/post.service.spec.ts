/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclePostStatus } from '@prisma/client';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { HelperPaginationService } from 'src/common/helper/services/helper.pagination.service';
import { VehiclePostCreateDto } from 'src/modules/post/dtos/request/vehicle-post.create.request';
import { VehiclePostGetDto } from 'src/modules/post/dtos/request/vehicle-post.get.request';
import { VehiclePostUpdateDto } from 'src/modules/post/dtos/request/vehicle-post.update.request';
import { VehiclePostService } from 'src/modules/post/services/vehicle-post.service';

describe('VehiclePostService', () => {
    let service: VehiclePostService;
    let helperPaginationService: HelperPaginationService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
        },
        vehiclePost: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    const mockHelperPaginationService = {
        paginate: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VehiclePostService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: HelperPaginationService,
                    useValue: mockHelperPaginationService,
                },
            ],
        }).compile();

        service = module.get<VehiclePostService>(VehiclePostService);
        helperPaginationService = module.get<HelperPaginationService>(
            HelperPaginationService
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createPostDto: VehiclePostCreateDto = {
            vehicleName: 'Honda Civic',
            price: 850000,
            vehicleCategory: 'SEDAN',
            location: 'Mumbai',
            fuelType: 'PETROL',
            kmsDriven: 45000,
            seatingCapacity: 5,
            engineDisplacement: '1497 cc',
            mileage: '16 km/l',
            maxPower: '118 HP',
            description: 'Well maintained Honda Civic in excellent condition',
            features: ['Air Conditioning', 'Power Steering', 'ABS'],
            images: ['image1.jpg', 'image2.jpg'],
            contactName: 'John Doe',
            contactNumber: '9876543210',
            yearOfManufacture: 2018,
            transmission: 'MANUAL',
        };

        it('should create a vehicle post successfully', async () => {
            const userId = 'user-123';
            const mockUser = { id: userId };
            const mockCreatedPost = {
                id: 'post-123',
                ...createPostDto,
                userId,
                postedBy: mockUser,
                images: [{ key: 'image1.jpg' }, { key: 'image2.jpg' }],
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                status: VehiclePostStatus.DRAFT,
                approvalNote: null,
                autoPublish: false,
            };

            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.vehiclePost.create.mockResolvedValue(
                mockCreatedPost
            );

            const result = await service.create(userId, createPostDto);

            expect(result).toEqual(mockCreatedPost);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: userId },
            });
            expect(mockPrismaService.vehiclePost.create).toHaveBeenCalledWith({
                data: {
                    postedBy: {
                        connect: { id: userId },
                    },
                    vehicleName: createPostDto.vehicleName,
                    price: createPostDto.price,
                    vehicleCategory: createPostDto.vehicleCategory,
                    location: createPostDto.location,
                    fuelType: createPostDto.fuelType,
                    kmsDriven: createPostDto.kmsDriven,
                    seatingCapacity: createPostDto.seatingCapacity,
                    engineDisplacement: createPostDto.engineDisplacement,
                    mileage: createPostDto.mileage,
                    maxPower: createPostDto.maxPower,
                    description: createPostDto.description,
                    features: createPostDto.features,
                    contactName: createPostDto.contactName,
                    contactNumber: createPostDto.contactNumber,
                    yearOfManufacture: createPostDto.yearOfManufacture,
                    transmission: createPostDto.transmission,
                    images: {
                        create: createPostDto.images.map(key => ({ key })),
                    },
                },
                include: {
                    postedBy: true,
                    images: true,
                },
            });
        });

        it('should throw an error if user is not found', async () => {
            const userId = 'non-existent-user';
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.create(userId, createPostDto)).rejects.toThrow(
                new HttpException(
                    'user.error.userNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });

        it('should handle database errors', async () => {
            const userId = 'user-123';
            mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });
            mockPrismaService.vehiclePost.create.mockRejectedValue(
                new Error('Database error')
            );

            await expect(service.create(userId, createPostDto)).rejects.toThrow(
                'Database error'
            );
        });
    });

    describe('delete', () => {
        const postId = 'post-123';
        const userId = 'user-123';

        it('should delete a vehicle post successfully', async () => {
            const mockPost = {
                id: postId,
                postedBy: { id: userId },
                status: VehiclePostStatus.DRAFT,
                approvalNote: null,
                autoPublish: false,
            };
            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(
                mockPost
            );
            mockPrismaService.vehiclePost.update.mockResolvedValue({
                ...mockPost,
                deletedAt: new Date(),
            });

            const result = await service.delete(userId, postId);

            expect(result).toEqual({
                success: true,
                message: 'post.success.postDeleted',
            });
            expect(
                mockPrismaService.vehiclePost.findUnique
            ).toHaveBeenCalledWith({
                where: { id: postId },
                include: { postedBy: true },
            });
            expect(mockPrismaService.vehiclePost.update).toHaveBeenCalledWith({
                where: { id: postId },
                data: { deletedAt: expect.any(Date) },
            });
        });

        it('should throw an error if post is not found', async () => {
            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(null);

            await expect(service.delete(userId, postId)).rejects.toThrow(
                new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });

        it('should throw an error if user is not the post owner', async () => {
            const mockPost = {
                id: postId,
                postedBy: { id: 'different-user' },
                status: VehiclePostStatus.DRAFT,
                approvalNote: null,
                autoPublish: false,
            };
            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(
                mockPost
            );

            await expect(service.delete(userId, postId)).rejects.toThrow(
                new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                )
            );
        });
    });

    describe('getAll', () => {
        const getPostsDto: VehiclePostGetDto = {
            limit: 10,
            page: 1,
            search: 'Honda',
        };

        it('should return paginated vehicle posts with search', async () => {
            const mockPaginatedResult = {
                metadata: {
                    totalItems: 1,
                    itemsPerPage: 10,
                    totalPages: 1,
                    currentPage: 1,
                },
                items: [
                    {
                        id: 'post-1',
                        vehicleName: 'Honda Civic',
                        price: 850000,
                        location: 'Mumbai',
                    },
                ],
            };

            mockHelperPaginationService.paginate.mockResolvedValue(
                mockPaginatedResult
            );

            const result = await service.getAll(getPostsDto);

            expect(result).toEqual(mockPaginatedResult);
            expect(helperPaginationService.paginate).toHaveBeenCalledWith(
                mockPrismaService.vehiclePost,
                { limit: getPostsDto.limit, page: getPostsDto.page },
                {
                    where: {
                        OR: [
                            {
                                vehicleName: {
                                    contains: getPostsDto.search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: getPostsDto.search,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                location: {
                                    contains: getPostsDto.search,
                                    mode: 'insensitive',
                                },
                            },
                        ],
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
        });

        it('should return paginated vehicle posts without search', async () => {
            const getPostsDtoNoSearch: VehiclePostGetDto = {
                limit: 10,
                page: 1,
            };
            const mockPaginatedResult = {
                metadata: {
                    totalItems: 1,
                    itemsPerPage: 10,
                    totalPages: 1,
                    currentPage: 1,
                },
                items: [
                    {
                        id: 'post-1',
                        vehicleName: 'Honda Civic',
                        price: 850000,
                    },
                ],
            };

            mockHelperPaginationService.paginate.mockResolvedValue(
                mockPaginatedResult
            );

            const result = await service.getAll(getPostsDtoNoSearch);

            expect(result).toEqual(mockPaginatedResult);
            expect(helperPaginationService.paginate).toHaveBeenCalledWith(
                mockPrismaService.vehiclePost,
                {
                    limit: getPostsDtoNoSearch.limit,
                    page: getPostsDtoNoSearch.page,
                },
                {
                    where: {
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
        });
    });

    describe('getById', () => {
        const postId = 'post-123';

        it('should return a vehicle post by id', async () => {
            const mockPost = {
                id: postId,
                vehicleName: 'Honda Civic',
                price: 850000,
                vehicleCategory: 'SEDAN',
                location: 'Mumbai',
                fuelType: 'PETROL',
                kmsDriven: 45000,
                seatingCapacity: 5,
                engineDisplacement: '1497 cc',
                mileage: '16 km/l',
                maxPower: '118 HP',
                description: 'Well maintained Honda Civic',
                features: ['Air Conditioning', 'Power Steering'],
                contactName: 'John Doe',
                contactNumber: '9876543210',
                yearOfManufacture: 2018,
                transmission: 'MANUAL',
                userId: 'user-123',
                images: [{ key: 'image1.jpg' }, { key: 'image2.jpg' }],
                postedBy: { id: 'user-123' },
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                status: VehiclePostStatus.DRAFT,
                approvalNote: null,
                autoPublish: false,
            };

            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(
                mockPost
            );

            const result = await service.getById(postId);

            expect(result).toEqual({
                id: mockPost.id,
                vehicleName: mockPost.vehicleName,
                price: mockPost.price,
                vehicleCategory: mockPost.vehicleCategory,
                location: mockPost.location,
                fuelType: mockPost.fuelType,
                kmsDriven: mockPost.kmsDriven,
                seatingCapacity: mockPost.seatingCapacity,
                engineDisplacement: mockPost.engineDisplacement,
                mileage: mockPost.mileage,
                maxPower: mockPost.maxPower,
                description: mockPost.description,
                features: mockPost.features,
                images: ['image1.jpg', 'image2.jpg'],
                contactName: mockPost.contactName,
                contactNumber: mockPost.contactNumber,
                yearOfManufacture: mockPost.yearOfManufacture,
                transmission: mockPost.transmission,
                userId: mockPost.userId,
                status: mockPost.status,
                approvalNote: mockPost.approvalNote,
                autoPublish: mockPost.autoPublish,
                createdAt: mockPost.createdAt,
                updatedAt: mockPost.updatedAt,
                deletedAt: mockPost.deletedAt,
            });
            expect(
                mockPrismaService.vehiclePost.findUnique
            ).toHaveBeenCalledWith({
                where: { id: postId },
                include: { images: true, postedBy: true },
            });
        });

        it('should throw an error if post is not found', async () => {
            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(null);

            await expect(service.getById(postId)).rejects.toThrow(
                new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });
    });

    describe('update', () => {
        const postId = 'post-123';
        const userId = 'user-123';
        const updatePostDto: VehiclePostUpdateDto = {
            vehicleName: 'Honda Civic Updated',
            price: 900000,
            description: 'Updated description',
        };

        it('should update a vehicle post successfully', async () => {
            const mockPost = {
                id: postId,
                postedBy: { id: userId },
                images: [{ key: 'image1.jpg' }],
                status: VehiclePostStatus.DRAFT,
                approvalNote: null,
                autoPublish: false,
            };
            const mockUpdatedPost = {
                ...mockPost,
                ...updatePostDto,
                images: [{ key: 'image1.jpg' }],
            };

            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(
                mockPost
            );
            mockPrismaService.vehiclePost.update.mockResolvedValue(
                mockUpdatedPost
            );

            const result = await service.update(userId, postId, updatePostDto);

            expect(result).toBeDefined();
            expect(mockPrismaService.vehiclePost.update).toHaveBeenCalledWith({
                where: { id: postId },
                data: expect.objectContaining({
                    vehicleName: updatePostDto.vehicleName,
                    price: updatePostDto.price,
                    description: updatePostDto.description,
                }),
                include: {
                    images: true,
                    postedBy: true,
                },
            });
        });

        it('should throw an error if post is not found', async () => {
            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(null);

            await expect(
                service.update(userId, postId, updatePostDto)
            ).rejects.toThrow(
                new HttpException(
                    'post.error.postNotFound',
                    HttpStatus.NOT_FOUND
                )
            );
        });

        it('should throw an error if user is not the post owner', async () => {
            const mockPost = {
                id: postId,
                postedBy: { id: 'different-user' },
                images: [],
                status: VehiclePostStatus.DRAFT,
                approvalNote: null,
                autoPublish: false,
            };
            mockPrismaService.vehiclePost.findUnique.mockResolvedValue(
                mockPost
            );

            await expect(
                service.update(userId, postId, updatePostDto)
            ).rejects.toThrow(
                new HttpException(
                    'auth.error.insufficientPermissions',
                    HttpStatus.FORBIDDEN
                )
            );
        });
    });
});
