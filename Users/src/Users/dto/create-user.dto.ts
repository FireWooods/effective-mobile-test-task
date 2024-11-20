import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  readonly name: string;
  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  readonly surname: string;
  @ApiProperty({ example: '20', description: 'Возраст пользователя' })
  readonly age: number;
  @ApiProperty({ example: 'мужчина', description: 'Пол пользователя' })
  readonly gender: string;
  @ApiProperty({ example: 'false', description: 'Наличие проблемы' })
  readonly problems: boolean;
}
