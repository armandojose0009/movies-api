import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Cinema } from '../entities/cinema.entity';
import { Showtime } from '../entities/showtime.entity';
import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      entities: [Movie, Cinema, Showtime, Ticket],
      migrations: ['src/database/migrations/*.ts'],
      synchronize: this.configService.get('NODE_ENV') === 'development',
    };
  }
}

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'movies_user',
  password: process.env.DB_PASSWORD || 'movies_pass',
  database: process.env.DB_DATABASE || 'movies_db',
  entities: [Movie, Cinema, Showtime, Ticket],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});