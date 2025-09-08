import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { Showtime } from '../entities/showtime.entity';
import { MoviesModule } from '../movies/movies.module';
import { CinemasModule } from '../cinemas/cinemas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime]), MoviesModule, CinemasModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
