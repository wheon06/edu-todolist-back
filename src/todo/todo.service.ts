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
    return await this.todoRepository.findAll();
  }

  async save(todoDto: TodoDto): Promise<Todo> {
    return await this.todoRepository.create({
      content: todoDto.content,
      isChecked: todoDto.isChecked,
      userId: todoDto.user.id,
    });
  }

  async updateIsChecked(
    id: number,
    isChecked: boolean,
    user: any,
  ): Promise<Todo> {
    await this.todoRepository.update(
      { isChecked },
      { where: { id, userId: user.id } },
    );

    return await this.todoRepository.findOne({
      where: { id, userId: user.id },
    });
  }

  async updateContent(id: number, content: string, user: any): Promise<Todo> {
    await this.todoRepository.update(
      { content },
      { where: { id, userId: user.id } },
    );

    return await this.todoRepository.findOne({
      where: { id, userId: user.id },
    });
  }

  async deleteTodo(id: number, user: any) {
    return await this.todoRepository.destroy({
      where: { id, userId: user.id },
    });
  }
}
