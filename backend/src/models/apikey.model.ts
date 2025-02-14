import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApiKeyDocument = ApiKey & Document;

@Schema({ timestamps: true })
export class ApiKey {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
