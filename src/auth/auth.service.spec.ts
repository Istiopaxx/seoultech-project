import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/user/user.repository';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
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
      providers: [AuthService, MockUserRepository, MockJwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
      expect(jwtService.sign).toBeCalledWith({
        email: user.email,
        sub: user._id,
      });
    });
  });
});
