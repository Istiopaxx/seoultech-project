import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { INestApplication } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { UserDocument } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from 'src/auth/auth.repository';
import { JwtService } from '@nestjs/jwt';

describe('Auth', () => {
  let app: INestApplication;
  let userModel;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let hashedUser;

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
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        AuthModule,
        UserModule,
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('DATABASE_URI') + '-auth',
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    userModel = module.get<UserDocument>(getModelToken('User'));
    authRepository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
    await app.init();

    hashedUser = {
      ...userData,
      password: await bcrypt.hash(userData.password, 5), // 5 is the saltRounds
    };
    await userModel.create(hashedUser);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => await userModel.deleteMany({}).exec());

  describe('user login', () => {
    it('user should login well', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(authCredentials)
        .expect(200);
      expect(res.body).toEqual({
        access_token: expect.anything(),
        refresh_token: expect.anything(),
      });
    });
  });

  describe('user refresh', () => {
    it('user should refresh well', async () => {
      const refresh_token = (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(authCredentials)
          .expect(200)
      ).body.refresh_token;
      const res = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token })
        .expect(200);
      expect(res.body).toEqual({
        access_token: expect.anything(),
        refresh_token: expect.anything(),
      });
    });
  });

  describe('user logout', () => {
    it('user should logout well', async () => {
      const refresh_token = (
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(authCredentials)
          .expect(200)
      ).body.refresh_token;
      await request(app.getHttpServer())
        .post('/auth/logout')
        .send({ refresh_token })
        .expect(204);
      expect(
        await authRepository.find(jwtService.verify(refresh_token).uuid),
      ).toBeUndefined();
    });
  });

  // describe('send auth email', () => {
  //   it('auth email should be sent well', async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/auth/send-auth-mail')
  //       .send({ email: authCredentials.email })
  //       .expect(204);
  //   });
  // });
});
