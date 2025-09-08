import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '../entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { ERROR_MESSAGES } from '../common/constants/messages.constants';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private cinemaRepository: Repository<Cinema>,
  ) {}

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    try {
      const cinema = this.cinemaRepository.create(createCinemaDto);
      return await this.cinemaRepository.save(cinema);
    } catch (error) {
      throw new InternalServerErrorException('Error creating cinema');
    }
  }

  async findAll(): Promise<Cinema[]> {
    try {
      return await this.cinemaRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching cinemas');
    }
  }

  async findOne(id: number): Promise<Cinema> {
    try {
      const cinema = await this.cinemaRepository.findOne({ where: { id } });
      if (!cinema) {
        throw new NotFoundException(ERROR_MESSAGES.CINEMA_NOT_FOUND.replace('{id}', id.toString()));
      }
      return cinema;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching cinema');
    }
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    try {
      await this.findOne(id);
      await this.cinemaRepository.update(id, updateCinemaDto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating cinema');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const cinema = await this.findOne(id);
      await this.cinemaRepository.remove(cinema);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting cinema');
    }
  }
}