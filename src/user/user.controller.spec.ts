import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a user', async () => {
      const result: Promise<User> = Promise.resolve({
        first_name: 'John',
        last_name: 'Doe',
        email: 'abc@email.com',
        password: 'abcd',
        phone: '01012341234',
        address: 'Korea',
        city: 'Seoul',
        gender: 'male',
      });
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
      jest.spyOn(service, 'create').mockImplementation(() => result);
      expect(await controller.create(createUserDto)).toBe(result);
    });
  });
});
