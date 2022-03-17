import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

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
  const user: User = {
    ...createUserDto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: getModelToken(User.name),
          useFactory: () => {
            return 1;
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(Promise.resolve(user));
      jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(Promise.resolve(null));
      expect(await service.create(createUserDto)).toBe(user);
    });

    it('should be reject when existing email', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(Promise.resolve(user));
      jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(Promise.resolve(user));
      expect(service.create(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should be reject when password not hashed', async () => {
      jest
        .spyOn(repository, 'create')
        .mockImplementation((dto) =>
          Promise.resolve({ ...dto, _id: expect.anything() }),
        );
      jest
        .spyOn(repository, 'findByEmail')
        .mockResolvedValue(Promise.resolve(null));
      const ret = await service.create(createUserDto);
      expect(ret.password).not.toBe(user.password);
    });
  });
});
