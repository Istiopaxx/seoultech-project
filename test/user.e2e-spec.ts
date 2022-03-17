import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserModule } from '../src/user/user.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UserDocument, User } from '../src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/user.repository';

describe('User', () => {
  let app: INestApplication;
  let userModel;
  const userData: CreateUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'abc@email.com',
    password: 'abcd',
    phone: '01012341234',
    address: 'Korea',
    city: 'Seoul',
    gender: 'male',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        MongooseModule.forRoot('mongodb://localhost:27017/seoultech-test'),
      ],
    }).compile();

    app = module.createNestApplication();
    userModel = module.get<UserDocument>(getModelToken('User'));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => await userModel.deleteMany({}).exec());

  describe('user create', () => {
    it('user should created well', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(201);
      expect(res.body).toEqual({
        ...userData,
        password: undefined,
        _id: expect.any(String),
      });
    });

    it('user password should be hashed', async () => {
      const rest = await request(app.getHttpServer())
        .post('/user')
        .send(userData)
        .expect(201);
      const user = await userModel.findById(rest.body._id);
      expect(user.password).not.toEqual(userData.password);
    });
  });
});
