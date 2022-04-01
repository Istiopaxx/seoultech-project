import { IsEmail, IsString } from 'class-validator';

export class AuthMailDto {
  @IsEmail()
  email: string;
}

export class AuthCodeDto {
  @IsString()
  code: string;

  @IsEmail()
  email: string;
}

export class AuthCodeResponse {
  access_token: string;
}
