import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'express-handlebars';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as fileStore from 'session-file-store'
import { ForbiddenExceptionFilter } from './exceptions-filters/forbidden.exception.filter';
import { UnauthorizedExceptionFilter } from './exceptions-filters/unauthorized.exception.filter';

async function bootstrap() {
  const FileStore = fileStore(session)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalFilters(new ForbiddenExceptionFilter(), new UnauthorizedExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('hbs', hbs.engine({ extname: 'hbs' }));
  app.setViewEngine('hbs');
  app.use(cookieParser());
  app.use(session({
    secret: 'asdinadnasndas892nad9823njfa0982nfej',
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
      path: join(__dirname, 'sessions')
    })
  }));

  await app.listen(3000);
}
bootstrap();
