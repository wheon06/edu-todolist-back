import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Todo } from './entities/todo.entity';
import { TodoDto } from './dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UseGuards(AuthGuard())
  async loadTodos(@Req() req: Request): Promise<Todo[]> {
    return await this.todoService.findAll();
  }

  @Post('save')
  @UseGuards(AuthGuard())
  async saveTodo(@Body() todoDto: TodoDto, @Req() req: Request): Promise<Todo> {
    const user: any = req.user;
    todoDto.user = user;

    return this.todoService.save(todoDto);
  }
}
