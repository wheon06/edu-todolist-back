import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';

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
}
