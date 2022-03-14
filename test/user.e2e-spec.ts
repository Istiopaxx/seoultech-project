import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserModule } from '../src/user/user.module';
import { UserService } from '../src/user/user.service';
import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { User } from '../src/schemas/user.schema';

describe('User', () => {
  let app: INestApplication;
  const userService = {
    findAll: () => ['test'],
    findOne: () => 'test',
    create: (createUserDto: CreateUserDto) => ({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: createUserDto.password,
      phone: createUserDto.phone,
      address: createUserDto.address,
      city: createUserDto.city,
      gender: createUserDto.gender,
    }),
    update: () => 'test',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`POST /user`, () => {
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
    return request(app.getHttpServer())
      .post('/user')
      .expect(201)
      .expect({
        data: userService.create(createUserDto),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
