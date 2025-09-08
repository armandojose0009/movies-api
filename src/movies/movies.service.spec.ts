import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from '../entities/movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockRepository.create.mockReturnValue(movie);
      mockRepository.save.mockResolvedValue(movie);

      const result = await service.create(createMovieDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockRepository.save).toHaveBeenCalledWith(movie);
      expect(result).toEqual(movie);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies = [{ id: 1, title: 'Test Movie' }];
      mockRepository.find.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(movies);
    });
  });

  describe('findOne', () => {
    it('should return a movie', async () => {
      const movie = { id: 1, title: 'Test Movie' };
      mockRepository.findOne.mockResolvedValue(movie);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(movie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const movie = { id: 1, title: 'Test Movie' };
      const updateDto = { title: 'Updated Movie' };
      const updatedMovie = { ...movie, ...updateDto };

      mockRepository.findOne.mockResolvedValue(movie);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne
        .mockResolvedValueOnce(movie)
        .mockResolvedValueOnce(updatedMovie);

      const result = await service.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      const movie = { id: 1, title: 'Test Movie' };
      mockRepository.findOne.mockResolvedValue(movie);
      mockRepository.remove.mockResolvedValue(movie);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(movie);
    });
  });
});
