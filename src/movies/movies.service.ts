import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ERROR_MESSAGES } from '../common/constants/messages.constants';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new InternalServerErrorException('Error creating movie');
    }
  }

  async findAll(): Promise<Movie[]> {
    try {
      return await this.movieRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching movies');
    }
  }

  async findOne(id: number): Promise<Movie> {
    try {
      const movie = await this.movieRepository.findOne({ where: { id } });
      if (!movie) {
        throw new NotFoundException(
          ERROR_MESSAGES.MOVIE_NOT_FOUND.replace('{id}', id.toString()),
        );
      }
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching movie');
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    try {
      await this.findOne(id);
      await this.movieRepository.update(id, updateMovieDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating movie');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const movie = await this.findOne(id);
      await this.movieRepository.remove(movie);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting movie');
    }
  }
}
