import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async join(userDto: UserDto): Promise<User> {
    const findUser = await this.userService.findByUsername(userDto.username);
    if (findUser) throw new ConflictException('User already exists');

    userDto.password = await this.encryptPassword(userDto.password);
    return await this.userService.save(userDto);
  }

  async validateUser(
    userDto: UserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const findUser = await this.userService.findByUsername(userDto.username);
    const isVaildate = bcrypt.compareSync(userDto.password, findUser.password);

    if (!findUser || !isVaildate)
      throw new UnauthorizedException('ID or password is not match');

    const payload: Payload = { id: findUser.id, username: findUser.username };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(findUser),
    };
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { id: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async validateRefreshToken(token: string): Promise<Payload> {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  }
}
