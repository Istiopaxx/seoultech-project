import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserModule } from 'src/user/user.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UserDocument } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('User', () => {
  let app: INestApplication;
  let userModel;
  let jwtService;
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
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        UserModule,
        AuthModule,
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('DATABASE_URI') + '-user',
          }),
          inject: [ConfigService],
        }),
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

  describe('user create', () => {
    it('user should created well', async () => {
      const access_token: string = await jwtService.sign({
        email: userData.email,
      });
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', 'Bearer ' + access_token)
        .send(userData)
        .expect(201);
      expect(res.body).toEqual({
        user: {
          ...userData,
          password: undefined,
          _id: expect.anything(),
        },
        token: expect.anything(),
      });
      const insertedUser = await userModel.findOne({ _id: res.body.user._id });
      expect(insertedUser).toMatchObject({
        ...userData,
        password: insertedUser.password,
        _id: expect.anything(),
      });
    });

    it('user password should be hashed', async () => {
      const access_token: string = await jwtService.sign({});
      const res = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', 'Bearer ' + access_token)
        .send(userData)
        .expect(201);
      const user = await userModel.findById(res.body.user._id);
      expect(user.password).not.toEqual(userData.password);
    });
  });
});
