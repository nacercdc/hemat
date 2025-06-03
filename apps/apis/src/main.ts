import './sentry';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigType } from './config/types';
import { validationOptions } from './shared/helpers';
import { GlobalExceptionFilter } from '@shared/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService<ConfigType>);
  const appName = configService.get('app.name', { infer: true }) || 'HIEMAT';
  const appVersion = configService.get('app.version', { infer: true }) || '1.0';

  const config = new DocumentBuilder()
    .setTitle(`${appName} API`)
    .setDescription(
      'The HIEMAT platform by Africa CDC enables countries to evaluate and improve health data exchange systems. It manages users, roles, assessments, and roadmaps for health information exchange.',
    )
    .setVersion(appVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
    customSiteTitle: 'HIEMAT API Documentation',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(helmet());
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

bootstrap();
