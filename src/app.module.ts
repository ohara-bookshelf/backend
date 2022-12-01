import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './api/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './api/books/books.module';
import { UsersModule } from './api/users/users.module';
import { BookshelvesModule } from './api/bookshelves/bookshelves.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ session: true }),
    AuthModule,
    PrismaModule,
    BooksModule,
    UsersModule,
    BookshelvesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
