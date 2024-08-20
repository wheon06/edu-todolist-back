import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
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
    if (!findUser) throw new NotFoundException('User not found');

    const isVaildate = bcrypt.compareSync(userDto.password, findUser.password);

    if (!findUser || !isVaildate)
      throw new UnauthorizedException('ID or password is not match');

    const payload: Payload = { id: findUser.id, username: findUser.username };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(findUser),
    };
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload = { id: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.validateRefreshToken(refreshToken);
    const newAccessToken = await this.generateAccessToken(user);
    return { accessToken: newAccessToken };
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return await this.userService.findById(payload.sub);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateRefreshToken(user: User): Promise<string> {
    const payload = { id: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async validateRefreshToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async tokenValidateUser(payload: Payload): Promise<User | undefined> {
    return await this.userService.findById(payload.id);
  }

  private async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  }
}
