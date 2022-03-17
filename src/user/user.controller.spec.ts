import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: () => 1,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a user', async () => {
      const result: CreateUserResponse = {
        _id: expect.anything(),
        first_name: 'John',
        last_name: 'Doe',
        email: 'abc@email.com',
        phone: '01012341234',
        address: 'Korea',
        city: 'Seoul',
        gender: 'male',
      };
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
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.create(createUserDto)).toBe(result);
    });
  });
});
