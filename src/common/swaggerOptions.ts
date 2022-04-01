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
  .addServer('http://localhost:' + process.env.PORT, 'Localhost')
  .addServer(process.env.HOST + ':' + process.env.PORT, 'server')
  .addBearerAuth()
  .build();
