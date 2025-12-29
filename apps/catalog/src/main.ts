import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { applyToMicroserviceLayer } from '@app/rpc';

async function bootstrap() {
  process.title = 'Catalog Service';

  const logger = new Logger('CatalogBoostrap');

  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

  const queue = process.env.CATALOG_QUEUE ?? 'catalog_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  applyToMicroserviceLayer(app);
  app.enableShutdownHooks();
  await app.listen();

  logger.log(`🚀 Catalog RMQ listening on queue:${queue} via ${rmqUrl}`);
}
bootstrap();
