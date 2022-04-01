import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import {
  swaggerDocumentconfig,
  swaggerCustomOptions,
} from './common/swaggerOptions';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, swaggerDocumentconfig);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
