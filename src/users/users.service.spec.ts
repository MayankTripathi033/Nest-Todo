import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.user({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.user({ email: 'notfound@example.com' });

      expect(result).toBeNull();
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1', password: 'hash1' },
        { id: '2', email: 'user2@example.com', name: 'User 2', password: 'hash2' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.users({});

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });

    it('should return users with pagination', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1', password: 'hash1' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.users({ skip: 0, take: 10 });

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        cursor: undefined,
        where: undefined,
        orderBy: undefined,
      });
    });
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'plainPassword',
      };

      const mockCreatedUser = {
        id: '1',
        email: userData.email,
        name: userData.name,
        password: 'hashedPassword',
      };

      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      const result = await service.createUser(userData);

      expect(result).toEqual(mockCreatedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      expect(createCall.data.email).toBe(userData.email);
      expect(createCall.data.password).not.toBe('plainPassword');
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateData = {
        where: { id: '1' },
        data: { name: 'Updated Name' },
      };

      const mockUpdatedUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Updated Name',
        password: 'hashedPassword',
      };

      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser(updateData);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        data: updateData.data,
        where: updateData.where,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockDeletedUser = {
        id: '1',
        email: 'deleted@example.com',
        name: 'Deleted User',
        password: 'hashedPassword',
      };

      mockPrismaService.user.delete.mockResolvedValue(mockDeletedUser);

      const result = await service.deleteUser({ id: '1' });

      expect(result).toEqual(mockDeletedUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
