import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';
import { MoviesService } from '../movies/movies.service';
import { CinemasService } from '../cinemas/cinemas.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimeRepository: Repository<Showtime>,
    private moviesService: MoviesService,
    private cinemasService: CinemasService,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto): Promise<Showtime> {
    const { movieId, cinemaId, startTime } = createShowtimeDto;

    // Validar que la película existe
    await this.moviesService.findOne(movieId);
    
    // Validar que la sala existe
    await this.cinemasService.findOne(cinemaId);

    // Validar que la fecha no sea en el pasado
    if (new Date(startTime) <= new Date()) {
      throw new BadRequestException('No se pueden crear funciones en el pasado');
    }

    const showtime = this.showtimeRepository.create(createShowtimeDto);
    return this.showtimeRepository.save(showtime);
  }

  findAll(): Promise<Showtime[]> {
    return this.showtimeRepository.find({
      relations: ['movie', 'cinema'],
    });
  }

  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: ['movie', 'cinema', 'tickets'],
    });
    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }
    return showtime;
  }

  async update(id: number, updateShowtimeDto: UpdateShowtimeDto): Promise<Showtime> {
    const showtime = await this.findOne(id);
    
    if (updateShowtimeDto.startTime && new Date(updateShowtimeDto.startTime) <= new Date()) {
      throw new BadRequestException('No se pueden programar funciones en el pasado');
    }

    await this.showtimeRepository.update(id, updateShowtimeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const showtime = await this.findOne(id);
    await this.showtimeRepository.remove(showtime);
  }

  async getAvailableSeats(id: number): Promise<number> {
    const showtime = await this.findOne(id);
    const soldTickets = showtime.tickets?.length || 0;
    return showtime.cinema.capacity - soldTickets;
  }
}