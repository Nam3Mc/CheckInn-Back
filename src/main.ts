import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

// Extender IoAdapter para manejar opciones de CORS
class CustomIoAdapter extends IoAdapter {
  constructor(app: any) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const corsOptions = {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        credentials: true,
      },
    };
    const server = super.createIOServer(port, { ...options, ...corsOptions });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Checkinn')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Utilizamos el adaptador personalizado que incluye la configuración de CORS
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  // Usar ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de CORS para solicitudes HTTP
  app.enableCors({
    origin: '*',  // Permite solicitudes desde el frontend
    methods: 'GET, PUT, PATCH, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(8080);
}
bootstrap();

  // app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  //   next();
  // });

