import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteUser(telegramId: string): Promise<{ message: string }> {
    await this.userModel.findOneAndDelete({ telegramId });
    return { message: 'User deleted' };
  }

  async updateUserBlockStatus(telegramId: string, isBlocked: boolean): Promise<{ message: string }> {
    await this.userModel.findOneAndUpdate({ telegramId }, { isBlocked });
    return { message: 'User updated' };
  }
}
