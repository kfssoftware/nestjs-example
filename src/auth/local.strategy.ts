import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../models/user/user.entity';
import { ResException } from 'src/common/resException';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new ResException(
        HttpStatus.NOT_FOUND,
        "general.user_not_found",
      );
    }
    return user;
  }
}
