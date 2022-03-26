import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
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
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
