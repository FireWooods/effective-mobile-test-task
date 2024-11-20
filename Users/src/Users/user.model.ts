import { ApiProperty } from '@nestjs/swagger';
import { Model, DataType, Table, Column } from 'sequelize-typescript';

interface IUsers {
  name: string;
  surname: string;
  age: number;
  gender: string;
  problems: boolean;
}

@Table({ tableName: 'users' })
export class User extends Model<User, IUsers> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;

  @ApiProperty({ example: '20', description: 'Возраст пользователя' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age: number;

  @ApiProperty({ example: 'мужчина', description: 'Пол пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @ApiProperty({ example: 'false', description: 'Наличие проблемы' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  problems: boolean;
}
