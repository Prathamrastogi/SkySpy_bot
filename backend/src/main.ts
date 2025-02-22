import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); 

  const port = process.env.PORT || 5000; // Ensure it binds to Render's assigned port
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
