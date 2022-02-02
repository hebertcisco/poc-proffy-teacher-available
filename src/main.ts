import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {PORT} from "./shared/common/constants/application";
import "reflect-metadata";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import {redisUrl} from "./shared/common/helpers/redis-url";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: { url: redisUrl },
  });
  const config = new DocumentBuilder()
      .setTitle('poc-teacher-has-available')
      .setDescription('Proffy service to check the teacher\'s availability to teach\n')
      .setVersion('0.0.1')
      .addTag('poc-teacher-has-available')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT);
}
bootstrap().then(()=>{
  process.stdout.write(`Application is running on: http://localhost:${PORT}`);
}).catch(err=>{
  console.error(err);
  process.exit(1);
});
