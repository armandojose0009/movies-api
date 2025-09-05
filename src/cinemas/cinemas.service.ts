import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '../entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemasService {
  constructor(
    @InjectRepository(Cinema)
    private cinemaRepository: Repository<Cinema>,
  ) {}

  create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const cinema = this.cinemaRepository.create(createCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  findAll(): Promise<Cinema[]> {
    return this.cinemaRepository.find();
  }

  async findOne(id: number): Promise<Cinema> {
    const cinema = await this.cinemaRepository.findOne({ where: { id } });
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }
    return cinema;
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    await this.findOne(id);
    await this.cinemaRepository.update(id, updateCinemaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cinema = await this.findOne(id);
    await this.cinemaRepository.remove(cinema);
  }
}