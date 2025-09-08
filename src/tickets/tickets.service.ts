import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ERROR_MESSAGES } from '../common/constants/messages.constants';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private showtimesService: ShowtimesService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    try {
      const { showtimeId, seatNumber } = createTicketDto;

      await this.showtimesService.findOne(showtimeId);

      const availableSeats =
        await this.showtimesService.getAvailableSeats(showtimeId);
      if (availableSeats <= 0) {
        throw new BadRequestException(ERROR_MESSAGES.NO_SEATS_AVAILABLE);
      }

      const existingTicket = await this.ticketRepository.findOne({
        where: { showtimeId, seatNumber },
      });
      if (existingTicket) {
        throw new BadRequestException(
          ERROR_MESSAGES.SEAT_OCCUPIED.replace('{seat}', seatNumber),
        );
      }

      const ticket = this.ticketRepository.create(createTicketDto);
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException('Error creating ticket');
    }
  }

  async findAll(): Promise<Ticket[]> {
    try {
      return await this.ticketRepository.find({
        relations: ['showtime', 'showtime.movie', 'showtime.cinema'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching tickets');
    }
  }

  async findOne(id: number): Promise<Ticket> {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['showtime', 'showtime.movie', 'showtime.cinema'],
      });
      if (!ticket) {
        throw new NotFoundException(
          ERROR_MESSAGES.TICKET_NOT_FOUND.replace('{id}', id.toString()),
        );
      }
      return ticket;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching ticket');
    }
  }

  async findByShowtime(showtimeId: number): Promise<Ticket[]> {
    try {
      return await this.ticketRepository.find({
        where: { showtimeId },
        relations: ['showtime'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching tickets by showtime',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const ticket = await this.findOne(id);
      await this.ticketRepository.remove(ticket);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting ticket');
    }
  }
}
