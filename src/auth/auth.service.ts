import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { CreateTokenResponse } from './dto/create-token.dto';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  AuthCodeDto,
  AuthCodeResponse,
  AuthMailDto,
} from './dto/auth-mail.dto';

@Injectable()
export class AuthService {
  transporter: any;
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('EMAIL_USER'),
        clientId: this.configService.get<string>('EMAIL_CLIENT_ID'),
        clientSecret: this.configService.get<string>('EMAIL_CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('EMAIL_REFRESH_TOKEN'),
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    const match = await bcrypt.compare(pass, user.password);
    if (user && match) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<CreateTokenResponse> {
    const uuid = uuid4();
    const payload = { uuid, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    const expiresIn = parseInt(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    );
    const refresh_token = this.jwtService.sign(
      { uuid, sub: user._id },
      { expiresIn },
    );
    this.authRepository.save(uuid, refresh_token, expiresIn);
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(user: any): Promise<CreateTokenResponse> {
    await this.authRepository.delete(user.uuid);
    return this.login(user);
  }

  async logout(user: any): Promise<void> {
    await this.authRepository.delete(user.uuid);
  }

  async sendAuthorizationEmail(authMailDto: AuthMailDto): Promise<void> {
    const authCode = this.generateAuthCode();
    this.authRepository.save(
      authMailDto.email,
      authCode,
      this.configService.get<number>('EMAIL_AUTH_EXPIRES_IN'),
    );
    const info = await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: authMailDto.email,
      subject: 'Authrization Code',
      html: `
        <h1> Authrization Code</h1>
        <p>Your authrization code is: </p>
        <p><b>${authCode}</b></p>
        <p> Please enter this code in the app.</p>
      `,
    });
    console.log(info);
    if (info.accepted.length === 0) {
      throw new BadRequestException('Email not sent.');
    }
  }

  async checkAuthorizationCode(
    authCodeDto: AuthCodeDto,
  ): Promise<AuthCodeResponse> {
    const authCode = await this.authRepository.find(authCodeDto.email);
    if (!authCode || authCodeDto.code !== authCode) {
      throw new UnauthorizedException();
    }
    return {
      access_token: this.jwtService.sign({ email: authCodeDto.email }),
    };
  }

  private generateAuthCode(): string {
    return Math.random().toString(10).substring(2, 8);
  }
}
