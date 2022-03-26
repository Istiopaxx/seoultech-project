import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export const swaggerDocumentconfig = new DocumentBuilder()
  .setTitle('Seoultech-project')
  .setDescription('The API description')
  .setVersion('1.0')
  .addServer('http://localhost:3000', 'Localhost')
  .addServer('http://localhost:4000', 'AWS')
  .addCookieAuth()
  .build();
