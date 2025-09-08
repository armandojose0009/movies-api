import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto = {
        title: 'Test Movie',
        description: 'Test Description',
        duration: 120,
        genre: 'Action',
        rating: 'PG-13',
      };
      const movie = { id: 1, ...createMovieDto };

      mockMoviesService.create.mockResolvedValue(movie);

      const result = await controller.create(createMovieDto);

      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(movie);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies = [{ id: 1, title: 'Test Movie' }];
      mockMoviesService.findAll.mockResolvedValue(movies);

      const result = await controller.findAll();

      expect(mockMoviesService.findAll).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  describe('findOne', () => {
    it('should return a movie', async () => {
      const movie = { id: 1, title: 'Test Movie' };
      mockMoviesService.findOne.mockResolvedValue(movie);

      const result = await controller.findOne('1');

      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(movie);
    });
  });
});
