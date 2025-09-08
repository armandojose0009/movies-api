import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from '../entities/ticket.entity';
import { ShowtimesService } from '../showtimes/showtimes.service';

describe('TicketsService', () => {
  let service: TicketsService;
  let repository: Repository<Ticket>;
  let showtimesService: ShowtimesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockShowtimesService = {
    findOne: jest.fn(),
    getAvailableSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockRepository,
        },
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    repository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketDto = {
        showtimeId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        seatNumber: 'A1',
      };
      const ticket = { id: 1, ...createTicketDto };

      mockShowtimesService.findOne.mockResolvedValue({ id: 1 });
      mockShowtimesService.getAvailableSeats.mockResolvedValue(10);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(ticket);
      mockRepository.save.mockResolvedValue(ticket);

      const result = await service.create(createTicketDto);

      expect(mockShowtimesService.findOne).toHaveBeenCalledWith(1);
      expect(mockShowtimesService.getAvailableSeats).toHaveBeenCalledWith(1);
      expect(result).toEqual(ticket);
    });

    it('should throw BadRequestException when no seats available', async () => {
      const createTicketDto = {
        showtimeId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        seatNumber: 'A1',
      };

      mockShowtimesService.findOne.mockResolvedValue({ id: 1 });
      mockShowtimesService.getAvailableSeats.mockResolvedValue(0);

      await expect(service.create(createTicketDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when seat is occupied', async () => {
      const createTicketDto = {
        showtimeId: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        seatNumber: 'A1',
      };

      mockShowtimesService.findOne.mockResolvedValue({ id: 1 });
      mockShowtimesService.getAvailableSeats.mockResolvedValue(10);
      mockRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(service.create(createTicketDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a ticket', async () => {
      const ticket = { id: 1, customerName: 'John Doe' };
      mockRepository.findOne.mockResolvedValue(ticket);

      const result = await service.findOne(1);

      expect(result).toEqual(ticket);
    });

    it('should throw NotFoundException when ticket not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
