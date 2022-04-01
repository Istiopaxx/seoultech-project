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
      refresh: jest.fn(() => Promise.resolve()),
      logout: jest.fn(() => Promise.resolve()),
      sendAuthorizationEmail: jest.fn(() => Promise.resolve()),
      checkAuthorizationCode: jest.fn(() => Promise.resolve()),
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

  it('refresh should call service.refresh', async () => {
    const user = new User();
    await controller.refresh({ user, uuid: expect.anything() });
    expect(service.refresh).toBeCalledWith(user);
  });

  it('logout should call service.logout', async () => {
    const user = new User();
    await controller.logout({ user, uuid: expect.anything() });
    expect(service.logout).toBeCalledWith(user);
  });

  it('sendAuthorizationEmail should call service.sendAuthorizationEmail', async () => {
    const dto = { email: new User().email };
    await controller.sendAuthorizationEmail(dto);
    expect(service.sendAuthorizationEmail).toBeCalledWith(dto);
  });

  it('checkAuthorizationCode should call service.checkAuthorizationCode', async () => {
    const dto = { email: expect.anything(), code: expect.anything() };
    await controller.checkAuthorizationCode(dto);
    expect(service.checkAuthorizationCode).toBeCalledWith(dto);
  });
});
