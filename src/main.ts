import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { microserviceConfig } from './microserviceConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Order Service')
    .setDescription('The order API description')
    .setVersion('1.0')
    .addTag('order')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice(microserviceConfig);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
