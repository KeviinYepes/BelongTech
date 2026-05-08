import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config();

function getConnectionString(databaseUrl: string) {
  if (!databaseUrl.startsWith('prisma+postgres://')) {
    return databaseUrl;
  }

  const parsedUrl = new URL(databaseUrl);
  const apiKey = parsedUrl.searchParams.get('api_key');

  if (!apiKey) {
    throw new Error('La URL prisma+postgres no contiene api_key.');
  }

  const payload = JSON.parse(
    Buffer.from(apiKey, 'base64url').toString('utf8'),
  ) as {
    databaseUrl?: string;
  };

  if (!payload.databaseUrl) {
    throw new Error('No se pudo obtener databaseUrl desde prisma+postgres.');
  }

  return payload.databaseUrl;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL no esta definida.');
    }

    const connectionString = getConnectionString(databaseUrl);
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
