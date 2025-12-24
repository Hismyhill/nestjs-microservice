import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'Catalog Service';

  const logger = new Logger('CatalogBoostrap');

  const port = Number(process.env.GATEWAY_PORT ?? 4011);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port },
    },
  );

  await app.listen();

  logger.log(`🚀 Catalog Service is running on: http://localhost:${port}`);
}
bootstrap();
