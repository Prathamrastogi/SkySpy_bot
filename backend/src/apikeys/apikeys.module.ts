import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKey, ApiKeySchema } from '../models/apikey.model';
import { ApiKeysService } from './apikeys.service';
import { ApiKeysController } from './apikeys.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }])],
  controllers: [ApiKeysController],
  providers: [ApiKeysService],
  exports: [ApiKeysService], // Exporting for usage in other modules
})
export class ApiKeysModule {}
