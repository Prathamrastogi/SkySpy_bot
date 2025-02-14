import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  telegramId: string;

  @Prop()
  firstName?: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  subscribed: boolean; // Controls access to /weather

  @Prop()
  step?: string; // Tracks user input state
}

export const UserSchema = SchemaFactory.createForClass(User);
