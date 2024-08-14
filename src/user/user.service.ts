import { Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { User } from './entities/user.entity';
import { JoinUserDto } from './dto/join-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: Repository<User>,
  ) {}

  async join(joinUserDto: JoinUserDto): Promise<any> {
    joinUserDto.password = await this.encryptPassword(joinUserDto.password);
    const user = await this.userRepository.create({
      username: joinUserDto.username,
      password: joinUserDto.password,
    });
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username: username } });
  }

  private async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  }
}
