import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || '8000';

  // This just for dev purposes, in real life would have to be more restrictive
  app.enableCors({
    origin: '*', // This allows requests from any origin
  });

  await app.listen(PORT, () => {
    console.info('nest campaign manager started on PORT:', PORT);
  });
}
bootstrap();
