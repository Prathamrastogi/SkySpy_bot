import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const bot = this.telegramService.getBot(); // ✅ Use the getter method
      await bot.handleUpdate(req.body);
      res.send('OK');
    } catch (error) {
      console.error('❌ Webhook error:', error);
      res.status(500).send('Error');
    }
  }

  @Get()
  async healthCheck(@Res() res: Response) {
    return res.json({ message: 'Telegram bot is running' });
  }
}
