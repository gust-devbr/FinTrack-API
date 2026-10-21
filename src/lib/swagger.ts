import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { INestApplication } from '@nestjs/common';

export function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('FinTrack API')
    .setDescription('The FinTrack API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
