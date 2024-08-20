import { User } from 'src/user/entities/user.entity';

export class TodoDto {
  content: string;
  isChecked: boolean;
  user: User;
}
