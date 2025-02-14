import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ApiKeysModule } from './apikeys/apikeys.module';
import { TelegramModule } from './telegram/telegram.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? '', {
      maxPoolSize: 10, // Prevent excessive memory usage
    }),
    UsersModule,
    ApiKeysModule,
    TelegramModule,
    AuthModule,
  ],
})
export class AppModule {}
