import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if username already exists', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValueOnce({});

      await expect(
        service.create({
          username: 'existingUser',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'password',
          first_name: 'John',
          last_name: 'Doe',
        }),
      ).rejects.toThrow('Username already exists');
    });

    it('should throw an error if email already exists', async () => {
      prismaService.user.findUnique = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({});

      await expect(
        service.create({
          username: 'newUser',
          email: 'existing@example.com',
          password: 'password',
          password_confirmation: 'password',
          first_name: 'John',
          last_name: 'Doe',
        }),
      ).rejects.toThrow('Email already exists');
    });

    it('should throw an error if passwords do not match', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(null);

      await expect(
        service.create({
          username: 'newUser',
          email: 'test@example.com',
          password: 'password',
          password_confirmation: 'differentPassword',
          first_name: 'John',
          last_name: 'Doe',
        }),
      ).rejects.toThrow('Passwords do not match');
    });

    it('should create a new user if all validations pass', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(null);
      prismaService.user.create = jest.fn().mockResolvedValueOnce({
        user_id: 'some_id',
        username: 'newUser',
        email: 'test@example.com',
        role: Role.USER,
        balance: 0,
      });

      const createUserDto = {
        username: 'newUser',
        email: 'test@example.com',
        password: 'password',
        password_confirmation: 'password',
        first_name: 'John',
        last_name: 'Doe',
      };

      const result = await service.create(createUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          username: 'newUser',
          email: 'test@example.com',
        }),
      });

      expect(result).toEqual(expect.any(Object)); // Assert that result is an object
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          user_id: '1',
          username: 'user1',
          email: 'user1@example.com',
          role: Role.USER,
        },
        {
          user_id: '2',
          username: 'user2',
          email: 'user2@example.com',
          role: Role.USER,
        },
      ];
      prismaService.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({ username: 'user1' }));
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const mockUser = {
        user_id: '1',
        username: 'user1',
        email: 'user1@example.com',
        role: Role.USER,
      };
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(expect.objectContaining({ username: 'user1' }));
    });
  });

  describe('increaseBalance', () => {
    it('should increase the user balance', async () => {
      const mockUser = { user_id: '1', balance: 100 };
      prismaService.user.update = jest.fn().mockResolvedValue({
        ...mockUser,
        balance: 150,
      });

      const result = await service.increaseBalance('1', 50);
      expect(result.balance).toBe(150);
    });
  });

  describe('update', () => {
    it('should update the user password and return the user', async () => {
      const mockUser = {
        user_id: '1',
        username: 'user1',
        email: 'user1@example.com',
        role: Role.USER,
      };
      prismaService.user.update = jest.fn().mockResolvedValue(mockUser);

      const updateUserDto = {
        password: 'newPassword',
      };

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(expect.objectContaining({ username: 'user1' }));
    });
  });

  describe('remove', () => {
    it('should delete a user by id', async () => {
      prismaService.user.delete = jest
        .fn()
        .mockResolvedValueOnce({ user_id: '1' });

      const result = await service.remove('1');
      expect(result.user_id).toBe('1');
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { user_id: '1' },
      });
    });
  });
});
