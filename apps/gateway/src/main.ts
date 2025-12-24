import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  process.title = 'gateway';

  const logger = new Logger('GatewayBoostrap');

  const app = await NestFactory.create(GatewayModule);

  app.enableShutdownHooks();

  const port = process.env.GATEWAY_PORT || 3000;

  await app.listen(port);

  logger.log(`Gateway is running on: http://localhost:${port}`);
}
bootstrap();
