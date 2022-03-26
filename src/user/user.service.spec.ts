import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUser,
  CreateUserDto,
  CreateUserResponse,
} from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { CreateTokenResponse } from 'src/auth/dto/create-token.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;
  const createUserDto: CreateUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'abc@email.com',
    password: 'abcd',
    phone: '01012341234',
    address: 'Korea',
    city: 'Seoul',
    gender: 'male',
  };
  const user: CreateUser = {
    password: undefined,
    _id: expect.anything(),
    ...createUserDto,
  };
  const token: CreateTokenResponse = {
    access_token: expect.anything(),
    refresh_token: expect.anything(),
  };
  const createUserResponse: CreateUserResponse = {
    user,
    token,
  };

  const MockUserRepository = {
    provide: UserRepository,
    useFactory: () => ({
      create: jest.fn(() => Promise.resolve(user)),
      findByEmail: jest.fn(() => Promise.resolve(createUserDto)),
    }),
  };

  const MockAuthService = {
    provide: AuthService,
    useFactory: () => ({
      login: jest.fn(() => Promise.resolve(token)),
    }),
  };

  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.develop',
          isGlobal: true,
        }),
      ],
      providers: [UserService, MockUserRepository, MockAuthService],
    }).compile();

    service = userModule.get<UserService>(UserService);
    repository = userModule.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(Promise.resolve(null));
      expect(await service.create(createUserDto)).toStrictEqual(
        createUserResponse,
      );
    });

    it('should be reject when existing email', async () => {
      expect(service.create(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
