import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { timestamp } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async updateUsers() {
    const users = await this.userRepository.update(
      { problems: false },
      {
        where: {
          problems: true,
        },
      },
    );

    return { success: true, body: `Количество изменений ${users}` };
  }

  async createFakeUser() {
    const arrFakeUsers = [];

    for (let i = 0; i < 1000; i++) {
      const fakeUser = {
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        age: faker.number.int({ min: 10, max: 60 }),
        gender: faker.person.sex(),
        problems: faker.datatype.boolean(),
      };

      arrFakeUsers.push(fakeUser);
    }

    for (let i = 0; i < 1000; i++) {
      await this.userRepository.bulkCreate(arrFakeUsers);
    }

    return { success: true };
  }
}
