import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import {
  swaggerDocumentconfig,
  swaggerCustomOptions,
} from './common/swaggerOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, swaggerDocumentconfig);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
