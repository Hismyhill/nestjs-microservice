import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../libs/rpc/src/http/http-exception.filter';

async function bootstrap() {
  process.title = 'gateway';

  const logger = new Logger('GatewayBoostrap');

  const app = await NestFactory.create(GatewayModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableShutdownHooks();

  const port = process.env.GATEWAY_PORT || 3000;

  await app.listen(port);

  logger.log(`Gateway is running on: http://localhost:${port}`);
}
bootstrap();
