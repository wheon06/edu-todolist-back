import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refreshToken = request.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const token = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken;

    const user = await this.authService.verifyRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    request.user = user;
    return true;
  }
}
