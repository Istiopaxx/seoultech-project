import { IsString, IsEmail } from 'class-validator';
import { CreateTokenResponse } from 'src/auth/dto/create-token.dto';
import { Types } from 'mongoose';
export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  gender: string;
}

export class CreateUser {
  _id: Types.ObjectId;

  first_name: string;

  last_name: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  gender: string;
}

export class CreateUserResponse {
  user: CreateUser;

  token: CreateTokenResponse;
}
