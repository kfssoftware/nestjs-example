import { Body, Controller, Post, Get, Req, Request, UseGuards, HttpStatus } from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { AuthResponse, AuthService } from './auth.service';
import { Status, UserType } from 'src/common/enums';
import { CreateUserDto } from 'src/models/user/user.dtos';
import { UserMapper } from 'src/models/user/user.mapper';
import { ResException } from 'src/common/resException';

export class LoginBody {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
export class SocialLoginBody {
  @ApiProperty()
  socialUserId: string;
  @ApiProperty()
  email: string;
}

export class RefreshBody {
  @ApiProperty()
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) { }

  @Get('userinfo')
  @UseGuards(JwtAuthGuard)
  async userinfo(@Request() req) {
    const res = await this.userService.myProfile(req.user);
    if (!res.data) {
      throw new ResException(
        HttpStatus.UNAUTHORIZED,
        "general.user_not_found"
      );
    }
    return {
      data: res.data,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: null,
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req, @Body() body: LoginBody) {
    return this.authService.login(req.user);
  }

  @Post('socialMedia')
  async socialMedia(@Body() body: SocialLoginBody) {
    return this.authService.socialMedia(body);
  }

  @Post('refreshToken')
  @Public()
  async refreshToken(@Body() body: RefreshBody) {
    return await this.authService.refresh(body.refreshToken);
  }

  @Get('decode')
  async decode(@Req() req) {
    return {
      user: req.user || null,
    };
  }

  @Post("/register")
  signup(@Body() userCreateDTO: CreateUserDto) {
    return this.userService._create(userCreateDTO);
  }
}
