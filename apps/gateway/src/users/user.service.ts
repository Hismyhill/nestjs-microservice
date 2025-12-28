import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async upsertAuthUser(input: {
    name: string;
    clerkUserId: string;
    email: string;
  }): Promise<UserDocument> {
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

    return this.findByclerkUserId(input.clerkUserId) as Promise<UserDocument>;
  }

  async findByclerkUserId(clerkUserId: string) {
    return this.userModel.findOne({ clerkUserId });
  }
}
