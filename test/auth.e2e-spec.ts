import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { INestApplication } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { UserDocument } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('Auth', () => {
  let app: INestApplication;
  let userModel;
  let jwtService: JwtService;

  const authCredentials = {
    email: 'adfasdf@email.com',
    password: 'abcd',
  };
  const userData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'adfasdf@email.com',
    password: 'abcd',
    phone: '01012341234',
    address: 'Korea',
    city: 'Seoul',
    gender: 'male',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        UserModule,
        MongooseModule.forRoot('mongodb://localhost:27017/seoultech-test'),
      ],
    }).compile();

    app = module.createNestApplication();
    userModel = module.get<UserDocument>(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => await userModel.deleteMany({}).exec());

  describe('user login', () => {
    it('user should login well', async () => {
      const hashedUser = {
        ...userData,
        password: await bcrypt.hash(userData.password, 5),
      };
      await userModel.create(hashedUser);
      const insertedUser = await userModel.findOne({
        email: authCredentials.email,
      });
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authCredentials)
        .expect(200);
      expect(res.body).toEqual({
        access_token: jwtService.sign({
          email: userData.email,
          sub: insertedUser._id,
        }),
      });
    });
  });
});
