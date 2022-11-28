import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString({ each: true })
  @IsNotEmpty()
  imageUrl: string[];
}

export class UpdateCommonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString({ each: true })
  @IsNotEmpty()
  imageUrl: string[];
}

export class CreateCommon {
  _id: Types.ObjectId;
  title: string;
  content: string;
  imageUrl: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}
