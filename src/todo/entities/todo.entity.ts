import {
  AutoIncrement,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

@Table({ paranoid: true })
export class Todo extends Model<Todo> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false })
  content: string;

  @Column({ allowNull: false })
  isChecked: boolean;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
