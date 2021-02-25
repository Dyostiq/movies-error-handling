import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { dbConfig } from './db.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MoviesModule,
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      useFactory: (config: ConfigType<typeof dbConfig>) => ({
        type: 'postgres',
        host: config.host,
        port: 5432,
        password: config.password,
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        username: config.user,
      }),
      inject: [dbConfig.KEY],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
