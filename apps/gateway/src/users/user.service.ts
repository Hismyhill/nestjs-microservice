import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async upsertUser(input: {
    name: string;
    clerkUserId: string;
    email: string;
    role: string;
    lastSeenAt: string;
  }) {
    const now = new Date();

    await this.userModel.findOneAndUpdate(
      {
        clerkUserId: input.clerkUserId,
      },

      {
        $set: {
          email: input.email,
          name: input.name,
          lastSeenAt: now,
        },

        $setOnInsert: {
          role: 'user',
        },
      },

      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async findByclerkUserId(clerkUserId: string) {
    return this.userModel.findById(clerkUserId);
  }
}
