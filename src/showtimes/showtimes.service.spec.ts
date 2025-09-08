import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from '../entities/showtime.entity';
import { MoviesService } from '../movies/movies.service';
import { CinemasService } from '../cinemas/cinemas.service';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let repository: Repository<Showtime>;
  let moviesService: MoviesService;
  let cinemasService: CinemasService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockMoviesService = {
    findOne: jest.fn(),
  };

  const mockCinemasService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: CinemasService,
          useValue: mockCinemasService,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    repository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    moviesService = module.get<MoviesService>(MoviesService);
    cinemasService = module.get<CinemasService>(CinemasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a showtime', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const createShowtimeDto = {
        movieId: 1,
        cinemaId: 1,
        startTime: futureDate,
        price: 25.5,
      };
      const showtime = { id: 1, ...createShowtimeDto };

      mockMoviesService.findOne.mockResolvedValue({ id: 1 });
      mockCinemasService.findOne.mockResolvedValue({ id: 1 });
      mockRepository.create.mockReturnValue(showtime);
      mockRepository.save.mockResolvedValue(showtime);

      const result = await service.create(createShowtimeDto);

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
      expect(mockCinemasService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(showtime);
    });

    it('should throw BadRequestException for past date', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const createShowtimeDto = {
        movieId: 1,
        cinemaId: 1,
        startTime: pastDate,
        price: 25.5,
      };

      mockMoviesService.findOne.mockResolvedValue({ id: 1 });
      mockCinemasService.findOne.mockResolvedValue({ id: 1 });

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAvailableSeats', () => {
    it('should return available seats', async () => {
      const showtime = {
        id: 1,
        cinema: { capacity: 100 },
        tickets: [{ id: 1 }, { id: 2 }],
      };
      mockRepository.findOne.mockResolvedValue(showtime);

      const result = await service.getAvailableSeats(1);

      expect(result).toBe(98);
    });
  });
});
