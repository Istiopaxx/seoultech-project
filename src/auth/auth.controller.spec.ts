import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const MockAuthService = {
    provide: AuthService,
    useFactory: () => ({
      login: jest.fn(() => Promise.resolve()),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [MockAuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should call service.login', async () => {
    const user = new User();
    await controller.login({ user });
    expect(service.login).toBeCalledWith(user);
  });
});
