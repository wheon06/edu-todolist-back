import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  async loadTodos(): Promise<Todo[]> {
    return await this.todoService.findAll();
  }

  @Post('save')
  @UseGuards(AuthGuard())
  async saveTodo(@Body() todoDto: TodoDto, @Req() req: Request): Promise<Todo> {
    const user: any = req.user;
    todoDto.user = user;

    return this.todoService.save(todoDto);
  }

  @Patch('update/isChecked/:id')
  @UseGuards(AuthGuard())
  async patchIsChecked(
    @Param('id') id: number,
    @Body('isChecked') isChecked: boolean,
    @Req() req: Request,
  ): Promise<Todo> {
    const user: any = req.user;
    return this.todoService.updateIsChecked(id, isChecked, user);
  }

  @Patch('update/content/:id')
  @UseGuards(AuthGuard())
  async patchContent(
    @Param('id') id: number,
    @Body('content') content: string,
    @Req() req: Request,
  ): Promise<Todo> {
    const user: any = req.user;
    return this.todoService.updateContent(id, content, user);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard())
  async deleteTodo(@Param('id') id: number, @Req() req: Request) {
    const user: any = req.user;
    return this.todoService.deleteTodo(id, user);
  }
}
