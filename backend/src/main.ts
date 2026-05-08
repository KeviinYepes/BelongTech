import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const allowedOrigins = new Set([
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.128.4:3000',
      ]);

      callback(null, allowedOrigins.has(origin));
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
