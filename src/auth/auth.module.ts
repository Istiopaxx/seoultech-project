import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtCheckStrategy,
  JwtStrategy,
  RefreshJwtStrategy,
} from './strategies/jwt.strategy';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(config.get<string>('JWT_EXPIRES_IN')),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
  ],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    JwtStrategy,
    JwtCheckStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
