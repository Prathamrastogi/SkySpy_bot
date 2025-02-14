import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey, ApiKeyDocument } from '../models/apikey.model';

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>) {}

  async getAllKeys(): Promise<ApiKey[]> {
    return this.apiKeyModel.find();
  }

  async getActiveKey(): Promise<string | null> {
    const activeKey = await this.apiKeyModel.findOne({ isActive: true });
    return activeKey ? activeKey.key : null;
  }

  async addKey(key: string): Promise<ApiKey> {
    if (!key) throw new BadRequestException('API key is required');

    const existingKey = await this.apiKeyModel.findOne({ key });
    if (existingKey) throw new BadRequestException('API key already exists');

    const newKey = new this.apiKeyModel({ key });
    return newKey.save();
  }

  async updateKeyStatus(key: string, isActive: boolean): Promise<ApiKey> {
    if (isActive) {
      // Deactivate all other API keys
      await this.apiKeyModel.updateMany({}, { isActive: false });
    }

    const updatedKey = await this.apiKeyModel.findOneAndUpdate({ key }, { isActive }, { new: true });

    if (!updatedKey) throw new NotFoundException('API key not found');
    return updatedKey;
  }

  async deleteKey(key: string): Promise<{ message: string }> {
    const deletedKey = await this.apiKeyModel.findOneAndDelete({ key });

    if (!deletedKey) throw new NotFoundException('API key not found');
    return { message: 'API key deleted' };
  }
}
