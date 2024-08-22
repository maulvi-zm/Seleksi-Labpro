import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { UserResponseDto } from './dto/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            increaseBalance: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        email: 'user@example.com',
        password: 'password',
        password_confirmation: 'password',
        first_name: 'John',
        last_name: 'Doe',
      };

      const result = { id: '1', ...createUserDto };

      jest.spyOn(usersService, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createUserDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: UserResponseDto[] = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          balance: 100,
          role: Role.USER,
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          balance: 200,
          role: Role.USER,
        },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const result: UserResponseDto = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        balance: 100,
        role: Role.USER,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('increaseBalance', () => {
    it('should increase a user balance by ID', async () => {
      const increment = 100;
      const result: UserResponseDto = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        balance: 200,
        role: Role.USER,
      };

      jest.spyOn(usersService, 'increaseBalance').mockResolvedValue(result);

      expect(await controller.increaseBalance('1', { increment })).toEqual(
        result,
      );
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUserDto: UpdateUserDto = { password: 'newPassword' };
      const result: UserResponseDto = {
        id: '1',
        username: 'user1',
        email: 'user1@example.com',
        balance: 100,
        role: Role.USER,
      };

      jest.spyOn(usersService, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateUserDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a user by ID', async () => {
      const result = { user_id: '1' };

      jest.spyOn(usersService, 'remove').mockResolvedValue(result as any);

      expect(await controller.remove('1')).toEqual(result);
    });
  });
});
