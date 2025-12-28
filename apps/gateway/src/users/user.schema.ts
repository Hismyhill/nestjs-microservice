import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  clerkUserId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['user', 'admin'] })
  role: 'user' | 'admin';

  @Prop({ default: false })
  isAdmin?: boolean;

  @Prop({ default: new Date() })
  lastSeenAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
