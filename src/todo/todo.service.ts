import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './entities/todo.entity';
import { Repository } from 'sequelize-typescript';
import { AuthService } from 'src/auth/auth.service';
import { TodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async save(todoDto: TodoDto): Promise<Todo> {
    return this.todoRepository.create({
      content: todoDto.content,
      isChecked: todoDto.isChecked,
      userId: todoDto.user.id,
    });
  }
}
