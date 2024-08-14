import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinUserDto } from './dto/join-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('join')
  async join(@Body() joinUserDto: JoinUserDto) {
    const findUser = await this.userService.findByUsername(
      joinUserDto.username,
    );

    if (findUser) {
      throw new ConflictException('User already exists');
    }

    this.userService.join(joinUserDto);
  }
}
