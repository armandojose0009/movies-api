import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { Cinema } from '../entities/cinema.entity';

describe('CinemasService', () => {
  let service: CinemasService;
  let repository: Repository<Cinema>;

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
        CinemasService,
        {
          provide: getRepositoryToken(Cinema),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CinemasService>(CinemasService);
    repository = module.get<Repository<Cinema>>(getRepositoryToken(Cinema));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cinema', async () => {
      const createCinemaDto = {
        name: 'Test Cinema',
        location: 'Test Location',
        capacity: 100,
      };
      const cinema = { id: 1, ...createCinemaDto };

      mockRepository.create.mockReturnValue(cinema);
      mockRepository.save.mockResolvedValue(cinema);

      const result = await service.create(createCinemaDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createCinemaDto);
      expect(result).toEqual(cinema);
    });
  });

  describe('findOne', () => {
    it('should return a cinema', async () => {
      const cinema = { id: 1, name: 'Test Cinema' };
      mockRepository.findOne.mockResolvedValue(cinema);

      const result = await service.findOne(1);

      expect(result).toEqual(cinema);
    });

    it('should throw NotFoundException when cinema not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});