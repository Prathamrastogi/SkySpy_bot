import { Controller, Get, Post, Patch, Delete, Body } from '@nestjs/common';
import { ApiKeysService } from './apikeys.service';

@Controller('apikeys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  async getAllKeys() {
    return this.apiKeysService.getAllKeys();
  }

  @Get('active')
  async getActiveKey() {
    return this.apiKeysService.getActiveKey();
  }

  @Post()
  async addKey(@Body() body: { key: string }) {
    return this.apiKeysService.addKey(body.key);
  }

  @Patch()
  async updateKeyStatus(@Body() body: { key: string; isActive: boolean }) {
    return this.apiKeysService.updateKeyStatus(body.key, body.isActive);
  }

  @Delete()
  async deleteKey(@Body() body: { key: string }) {
    return this.apiKeysService.deleteKey(body.key);
  }
}
