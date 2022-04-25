import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthCodeDto,
  AuthCodeResponse,
  AuthMailDto,
} from './dto/auth-mail.dto';
import {
  CreateTokenDto,
  CreateTokenResponse,
  RefreshTokenDto,
} from './dto/create-token.dto';
import { RefreshJwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*
   * Login User
   *
   * 전달된 인증 정보를 검사하여 access_token과 refresh_token을 발급한다.
   */
  @ApiBody({ type: CreateTokenDto })
  @ApiOkResponse({
    description: 'Login successfully.',
    type: CreateTokenResponse,
  })
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /*
   * Refresh access token
   *
   * api req body의 refresh_token을 삭제하고, 새로운 access_token과
   * refresh_token을 발급한다.
   */
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'Refresh access token successfully.',
    type: CreateTokenResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }

  /*
   * Logout User
   *
   * api request body의 refresh_token을 삭제한다.
   */
  @ApiBody({ type: RefreshTokenDto })
  @ApiNoContentResponse({
    description: 'Logout successfully.',
  })
  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  /*
   * Send Authorization Email
   *
   * api request body의 email로 인증코드를 담은 메일을 전송한다.
   * 인증 코드는 랜덤하게 생성되며, 3분의 TTL을 가지고 로컬 저장소에 저장된다.
   * 모종의 이유로 이메일이 전달되지 않을 경우 400 에러를 전송한다.
   */
  @ApiBody({ type: AuthMailDto })
  @ApiNoContentResponse({
    description: 'Send mail successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Email not sent.',
    type: BadRequestException,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/send-auth-mail')
  async sendAuthorizationEmail(@Body() authMailDto: AuthMailDto) {
    return this.authService.sendAuthorizationEmail(authMailDto);
  }

  /*
   * Check Authorization Code
   *
   * api request body의 이메일과 인증코드를 로컬 저장소에서 검사한다.
   * 이메일과 인증코드가 일치하면 인증코드를 삭제하고 토큰을 발급한다.
   * 인증코드는 3분의 TTL이 설정되어 있다.
   * 토큰은 POST /user 로 요청을 보낼 때 Authorization 헤더에 Bearer 토큰을 전달한다.
   */
  @ApiBody({ type: AuthCodeDto })
  @ApiOkResponse({
    description: 'Validate auth code successfully.',
    type: AuthCodeResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/check-auth-code')
  async checkAuthorizationCode(@Body() authCodeDto: AuthCodeDto) {
    return this.authService.checkAuthorizationCode(authCodeDto);
  }
}
