import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function isAllowedDevOrigin(origin: string) {
  try {
    const parsedOrigin = new URL(origin);
    const { protocol, hostname, port } = parsedOrigin;

    if (!['http:', 'https:'].includes(protocol)) {
      return false;
    }

    if (port !== '3000') {
      return false;
    }

    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1';

    const isPrivateIpv4 =
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);

    const looksLikeLanHostname =
      !hostname.includes('.') && hostname !== 'localhost';

    return isLocalhost || isPrivateIpv4 || looksLikeLanHostname;
  } catch {
    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, isAllowedDevOrigin(origin));
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
