// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUser(profile: any): Promise<UserDocument> {
    const { id, displayName, emails } = profile;

    let user = await this.userModel.findOne({ telegramId: id });

    if (!user) {
      // Only create user if they don't already exist
      user = new this.userModel({
        telegramId: id,
        firstName: displayName,
        isBlocked: false,
        subscribed: false,
      });
      await user.save();
    }

    // Return the user object without altering the DB structure
    return user;
  }
}
