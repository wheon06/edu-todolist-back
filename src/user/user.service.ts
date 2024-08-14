import { Repository } from 'sequelize-typescript';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(userDto: UserDto): Promise<User> {
    return this.userRepository.create({
      username: userDto.username,
      password: userDto.password,
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username: username } });
  }
}
