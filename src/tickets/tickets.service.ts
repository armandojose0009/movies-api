import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private showtimesService: ShowtimesService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { showtimeId, seatNumber } = createTicketDto;

    // Validar que la función existe
    const showtime = await this.showtimesService.findOne(showtimeId);

    // Verificar que no se supere la capacidad
    const availableSeats = await this.showtimesService.getAvailableSeats(showtimeId);
    if (availableSeats <= 0) {
      throw new BadRequestException('No hay asientos disponibles para esta función');
    }

    // Verificar que el asiento no esté ocupado
    const existingTicket = await this.ticketRepository.findOne({
      where: { showtimeId, seatNumber },
    });
    if (existingTicket) {
      throw new BadRequestException(`El asiento ${seatNumber} ya está ocupado`);
    }

    const ticket = this.ticketRepository.create(createTicketDto);
    return this.ticketRepository.save(ticket);
  }

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      relations: ['showtime', 'showtime.movie', 'showtime.cinema'],
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['showtime', 'showtime.movie', 'showtime.cinema'],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async findByShowtime(showtimeId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { showtimeId },
      relations: ['showtime'],
    });
  }

  async remove(id: number): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket);
  }
}