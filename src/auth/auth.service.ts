import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { CreateTokenResponse } from './dto/create-token.dto';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const match = await bcrypt.compare(pass, user.password);
    if (user && match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<CreateTokenResponse> {
    const uuid = uuid4();
    const payload = { uuid, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(
      { uuid, sub: user._id },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );
    this.authRepository.saveToken(uuid, refresh_token, 14 * 24 * 60 * 60);
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(user: any): Promise<CreateTokenResponse> {
    await this.authRepository.deleteToken(user.uuid);
    return this.login(user);
  }

  async logout(user: any): Promise<void> {
    await this.authRepository.deleteToken(user.uuid);
  }
}
