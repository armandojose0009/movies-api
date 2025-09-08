import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { Cinema } from '../entities/cinema.entity';
import { Showtime } from '../entities/showtime.entity';

@Injectable()
export class DatabaseInitService {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async initializeDatabase(): Promise<void> {
    if (this.configService.get('NODE_ENV') !== 'development') {
      return;
    }

    try {
      await this.runMigrationsIfNeeded();
      await this.seedDataIfNeeded();
    } catch (error) {
      this.logger.error('Database initialization failed:', error);
    }
  }

  private async runMigrationsIfNeeded(): Promise<void> {
    const pendingMigrations = await this.dataSource.showMigrations();

    if (pendingMigrations) {
      this.logger.log('Running pending migrations...');
      await this.dataSource.runMigrations();
      this.logger.log('Migrations completed successfully');
    } else {
      this.logger.log('No pending migrations');
    }
  }

  private async seedDataIfNeeded(): Promise<void> {
    const movieRepository = this.dataSource.getRepository(Movie);
    const existingMovies = await movieRepository.count();

    if (existingMovies === 0) {
      this.logger.log('No data found, running seed...');
      await this.seedData();
      this.logger.log('Seed data created successfully');
    } else {
      this.logger.log('Database already has data, skipping seed');
    }
  }

  private async seedData(): Promise<void> {
    const movieRepository = this.dataSource.getRepository(Movie);
    const cinemaRepository = this.dataSource.getRepository(Cinema);
    const showtimeRepository = this.dataSource.getRepository(Showtime);

    const movies = await movieRepository.save([
      {
        title: 'Avatar: The Way of Water',
        description: 'Sequel to the successful Avatar movie',
        duration: 192,
        genre: 'Science Fiction',
        rating: 'PG-13',
      },
      {
        title: 'Top Gun: Maverick',
        description:
          'Pete "Maverick" Mitchell returns after more than 30 years',
        duration: 131,
        genre: 'Action',
        rating: 'PG-13',
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'Peter Parker must face villains from other dimensions',
        duration: 148,
        genre: 'Superhero',
        rating: 'PG-13',
      },
    ]);

    const cinemas = await cinemaRepository.save([
      {
        name: 'IMAX Theater',
        location: 'Plaza Norte Shopping Center',
        capacity: 300,
      },
      {
        name: 'Premium Theater',
        location: 'Cinépolis Multiplaza',
        capacity: 150,
      },
      {
        name: 'VIP Theater',
        location: 'Cinemark Megaplaza',
        capacity: 80,
      },
    ]);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(19, 30, 0, 0);

    await showtimeRepository.save([
      {
        movieId: movies[0].id,
        cinemaId: cinemas[0].id,
        startTime: tomorrow,
        price: 25.5,
      },
      {
        movieId: movies[1].id,
        cinemaId: cinemas[1].id,
        startTime: dayAfterTomorrow,
        price: 22.0,
      },
      {
        movieId: movies[2].id,
        cinemaId: cinemas[2].id,
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        price: 30.0,
      },
    ]);
  }
}
