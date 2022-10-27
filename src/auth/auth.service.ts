import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../models/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user/user.entity';
import { ResException } from '../common/resException';
import { Status, UserType } from 'src/common/enums';
import { SocialLoginBody } from './auth.controller';

export class AuthResponse {
  @ApiProperty()
  public user: User;
  @ApiProperty()
  public access_token: string;
  @ApiProperty()
  public refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.detailLogin(username);
    if (!user) {
      return null;
    }
    const passwordOk = bcrypt.compareSync(password, user.password);
    if (!passwordOk) {
      return null;
    }

    return user;
  }

  async socialMedia(body: SocialLoginBody) {
    const user = await this.userService.detailSocialLogin(body.socialUserId);
    if (!user) {
      const getNormalUser = await this.userService.detailLogin(body.email);
      if (getNormalUser)
        throw new ResException(
          HttpStatus.NOT_FOUND,
          'general.social_user_not_found',
        );
      else
        throw new ResException(
          HttpStatus.NOT_FOUND,
          'general.user_not_found',
        );
    }
    return this.genAuthResponse(user);
  }

  async login(user: User) {
    await this.hasUserPermissionToLogin(user);
    return this.genAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    let verifiedToken: Partial<User>;
    try {
      verifiedToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('AUTH_REFRESH_SECRET'),
      });
    } catch (_e) {
      throw new ResException(
        HttpStatus.EXPECTATION_FAILED,
        'RefreshToken expired',
      );
    }

    const user = await this.userService.detail(verifiedToken.id);
    await this.hasUserPermissionToLogin(user.data);

    return this.genAuthResponse(user.data);

    // TODO
    /*const tokenCreationDate = new Date(verifiedToken.iat * 1000);
    if (user.passwordDate.getTime() > tokenCreationDate.getTime()) {
      throw {
        code: 410,
        message:
          'Password was changed in the meantime. You have to perform a new login',
      };
    }
    /**/
  }

  private genAuthResponse(user: User): object {
    const tokenPayload: object = { ...user };
    return {
      data: {
        user,
        accessToken: this.jwtService.sign(tokenPayload),
        refreshToken: this.genRefreshToken(tokenPayload),
      },
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: null,
    };
  }

  private genRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('AUTH_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('AUTH_REFRESH_TOKEN_LIFETIME'),
    });
  }

  /**
   * Check if user is active, has a licence, it's company is active and not deleted..
   * @private
   * @throws ResException
   */
  private async hasUserPermissionToLogin(user: User): Promise<boolean> {
    if (!user || user.status != Status.Active) {
      throw new ResException(HttpStatus.NOT_FOUND, 'general.user_not_found');
    }
    if (!user.password) {
      throw new ResException(
        HttpStatus.PRECONDITION_FAILED,
        'general.user_not_password',
      );
    }
    return true;
  }
}
