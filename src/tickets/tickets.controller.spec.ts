import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockTicketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByShowtime: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockTicketsService.create.mockResolvedValue(ticket);

      const result = await controller.create(createTicketDto);

      expect(mockTicketsService.create).toHaveBeenCalledWith(createTicketDto);
      expect(result).toEqual(ticket);
    });
  });

  describe('findByShowtime', () => {
    it('should return tickets for a showtime', async () => {
      const tickets = [{ id: 1, showtimeId: 1 }];
      mockTicketsService.findByShowtime.mockResolvedValue(tickets);

      const result = await controller.findByShowtime('1');

      expect(mockTicketsService.findByShowtime).toHaveBeenCalledWith(1);
      expect(result).toEqual(tickets);
    });
  });
});
