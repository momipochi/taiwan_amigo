import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function swaggerSetup(app: INestApplication): Promise<boolean | any> {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        '\n\n\u001b[32m[SWAGGER]\u001b[0m \x1b[33m While the application is running, open your browser and navigate to\x1b[0m \u001b[34mhttp://localhost:3000/api\u001b[0m\x1b[33m. You should see the Swagger UI.\n\n\x1b[0m',
      );
      const config = new DocumentBuilder()
        .setTitle('Taiwan amigo')
        .setDescription('Taiwan amigo API description')
        .setVersion('1.0')
        .addTag('tw_amigo')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await swaggerSetup(app);

  await app.listen(3000);
}
bootstrap();
