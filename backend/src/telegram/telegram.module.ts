import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { User, UserSchema } from '../models/user.model';
import { ApiKeysModule } from '../apikeys/apikeys.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ApiKeysModule,
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
