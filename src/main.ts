import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  console.log(process.env.SECRET_KEY);
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
