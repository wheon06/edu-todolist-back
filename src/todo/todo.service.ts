import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './entities/todo.entity';
import { Repository } from 'sequelize-typescript';
import { TodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private readonly todoRepository: Repository<Todo>,
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

  async updateIsChecked(
    id: string,
    isChecked: boolean,
    user: any,
  ): Promise<Todo> {
    await this.todoRepository.update(
      { isChecked },
      { where: { id, userId: user.id } },
    );
    return this.todoRepository.findOne({ where: { id, userId: user.id } });
  }
}
