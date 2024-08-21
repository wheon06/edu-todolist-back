import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { RefreshTokenGuard } from './security/refresh.token.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  async join(@Body() userDto: UserDto): Promise<any> {
    return await this.authService.join(userDto);
  }

  @Post('login')
  async login(@Body() userDto: UserDto, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.validateUser(userDto);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res() res: Response,
  ) {
    try {
      const { accessToken } =
        await this.authService.refreshAccessToken(refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const user: any = req.user;
    const accessToken = await this.authService.generateAccessToken(user);
    return { accessToken };
  }

  @Get('userInfo')
  @UseGuards(AuthGuard())
  async authenticate(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    return user;
  }
}
