import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtCheckGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
   * Create a User
   *
   * 전달된 Authrization header를 검사하여 토큰이 유효한지 확인한다.
   * 이 토큰은 send-auth-mail, check-auth-code를 통해 발급된다.
   * 이메일이 중복되는지 확인하고, 중복되지 않으면 사용자 생성을 진행한다.
   * 이메일 중복이면 BadRequestException을 발생시킨다.
   * 사용자 생성이 성공하면 201 Created를 반환한다.
   * 동시에 login 작업을 수행하여 access_token과 refresh_token을 발급한다.
   */
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserResponse,
  })
  @ApiBadRequestResponse({
    description: 'Email duplicated.',
    type: BadRequestException,
  })
  @ApiBearerAuth()
  @UseGuards(JwtCheckGuard)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
