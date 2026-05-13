import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API Documentation for the project')
      .setVersion('1.0')
      .addTag('API')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
