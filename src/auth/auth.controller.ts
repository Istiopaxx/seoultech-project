import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCodeDto, AuthMailDto } from './dto/auth-mail.dto';
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
   * Send authrization email
   */
  @ApiBody({ type: AuthMailDto })
  @ApiOkResponse({
    description: 'Send mail successfully.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/send-auth-mail')
  async sendAuthorizationEmail(@Body() authMailDto: AuthMailDto) {
    return this.authService.sendAuthorizationEmail(authMailDto);
  }

  /*
   * Check authorization code
   */
  @ApiBody({ type: AuthCodeDto })
  @ApiOkResponse({
    description: 'Validate auth code successfully.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/check-auth-code')
  async checkAuthorizationCode(@Body() authCodeDto: AuthCodeDto) {
    return this.authService.checkAuthorizationCode(authCodeDto);
  }
}
