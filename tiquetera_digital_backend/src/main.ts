import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Crear la aplicación NestJS
  const app = await NestFactory.create(AppModule);
  
  // Configuración del prefijo global de la API
  app.setGlobalPrefix('api');
  
  // Configuración de seguridad con helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Desactivar CSP para que Swagger funcione correctamente
    })
  );
  
  // Configuración de compresión para reducir tamaño de las respuestas
  app.use(compression());
  
  // Logger de solicitudes HTTP para monitoreo
  app.use(morgan('combined'));
  
  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:8100', '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Tiquetera Restaurant API')
    .setDescription('API para el sistema de gestión de tiqueteras de restaurantes')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Servidor local')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Configurar Swagger en múltiples rutas para mayor accesibilidad
  SwaggerModule.setup('api/docs', app, document);
  SwaggerModule.setup('api', app, document); // También disponible en /api
  SwaggerModule.setup('docs', app, document); // También disponible en /docs
  
  // Guardar documento Swagger como JSON para uso con herramientas externas
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  
  // Obtener puerto de la configuración
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  // Redirección desde la raíz a la documentación API
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api');
  });
  
  // Iniciar el servidor
  await app.listen(port);
  logger.log(`Aplicación iniciada en el puerto ${port}`);
  logger.log(`Documentación de la API disponible en:`);
  logger.log(`- http://localhost:${port}/api`);
  logger.log(`- http://localhost:${port}/api/docs`);
  logger.log(`- http://localhost:${port}/docs`);
}

bootstrap(); 