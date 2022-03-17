import { IsString, IsEmail } from 'class-validator';

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

export class CreateUserResponse {
  _id: string;

  first_name: string;

  last_name: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  gender: string;
}
