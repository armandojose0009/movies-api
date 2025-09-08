import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
import { MoviesService } from '../movies/movies.service';
import { CinemasService } from '../cinemas/cinemas.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ERROR_MESSAGES } from '../common/constants/messages.constants';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    private moviesService: MoviesService,
    private cinemasService: CinemasService,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    try {
      const { movieId, cinemaId, startTime } = createShowtimeDto;

      await this.moviesService.findOne(movieId);
      await this.cinemasService.findOne(cinemaId);

      if (new Date(startTime) <= new Date()) {
        throw new BadRequestException(ERROR_MESSAGES.PAST_DATE_SHOWTIME);
      }

      const showtime = this.showtimeRepository.create(createShowtimeDto);
      return await this.showtimeRepository.save(showtime);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException('Error creating showtime');
    }
  }

  async findAll(): Promise<Showtime[]> {
    try {
      return await this.showtimeRepository.find({
        relations: ['movie', 'cinema'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching showtimes');
    }
  }

  async findOne(id: number): Promise<Showtime> {
    try {
      const showtime = await this.showtimeRepository.findOne({
        where: { id },
        relations: ['movie', 'cinema', 'tickets'],
      });
      if (!showtime) {
        throw new NotFoundException(
          ERROR_MESSAGES.SHOWTIME_NOT_FOUND.replace('{id}', id.toString()),
        );
      }
      return showtime;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching showtime');
    }
  }

  async update(
    id: number,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<Showtime> {
    try {
      await this.findOne(id);

      if (
        updateShowtimeDto.startTime &&
        new Date(updateShowtimeDto.startTime) <= new Date()
      ) {
        throw new BadRequestException(ERROR_MESSAGES.PAST_DATE_UPDATE);
      }

      await this.showtimeRepository.update(id, updateShowtimeDto);
      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException('Error updating showtime');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const showtime = await this.findOne(id);
      await this.showtimeRepository.remove(showtime);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting showtime');
    }
  }

  async getAvailableSeats(id: number): Promise<number> {
    try {
      const showtime = await this.findOne(id);
      const soldTickets = showtime.tickets?.length || 0;
      return showtime.cinema.capacity - soldTickets;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error calculating available seats',
      );
    }
  }
}
