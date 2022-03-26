import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/user.repository';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { ConfigModule } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { CreateTokenResponse } from './dto/create-token.dto';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let jwtService: JwtService;

  const user = {
    _id: 'aaaa',
    password: '123456',
    email: 'user@example.com',
  };
  const hashedUser = {
    ...user,
    password: bcrypt.hashSync(user.password, 5),
  };

  const MockUserRepository = {
    provide: UserRepository,
    useFactory: () => ({
      findByEmail: jest.fn(() => Promise.resolve(hashedUser)),
    }),
  };

  const MockAuthRepository = {
    provide: AuthRepository,
    useFactory: () => ({
      saveToken: jest.fn(() => Promise.resolve(null)),
      deleteToken: jest.fn(() => Promise.resolve(null)),
    }),
  };

  const MockJwtService = {
    provide: JwtService,
    useFactory: () => ({
      sign: jest.fn(() => Promise.resolve('token')),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.develop',
          isGlobal: true,
        }),
      ],
      providers: [
        AuthService,
        MockUserRepository,
        MockAuthRepository,
        MockJwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should match the valid password', async () => {
      expect(
        await service.validateUser(user.email, user.password),
      ).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should return valid jwt token', async () => {
      expect(await service.login(user)).toBeTruthy();
      expect(jwtService.sign).toBeCalled();
      expect(repository.saveToken).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        expect.any(Number),
      );
    });
  });

  describe('refresh', () => {
    it('should return valid jwt token', async () => {
      jest
        .spyOn(service, 'login')
        .mockResolvedValue(Promise.resolve(new CreateTokenResponse()));
      expect(
        await service.refresh({ ...user, uuid: expect.anything() }),
      ).toBeTruthy();
      expect(repository.deleteToken).toBeCalled();
      expect(service.login).toBeCalled();
    });
  });

  describe('logout', () => {
    it('should delete refresh token', async () => {
      await service.logout({ ...user, uuid: expect.anything() });
      expect(repository.deleteToken).toBeCalled();
    });
  });
});
