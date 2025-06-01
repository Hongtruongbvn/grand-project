import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS, cho phép frontend localhost:5173 truy cập
  app.enableCors({
    origin: 'http://localhost:5173',  // hoặc '*' nếu muốn cho tất cả domain (không khuyến nghị)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
