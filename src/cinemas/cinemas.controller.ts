import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Cinema } from '../entities/cinema.entity';
import { SUCCESS_MESSAGES, API_SUMMARIES, API_DESCRIPTIONS } from '../common/constants/messages.constants';

@ApiTags('cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @ApiOperation({ summary: API_SUMMARIES.CREATE_CINEMA })
  @ApiResponse({ status: 201, description: SUCCESS_MESSAGES.CINEMA_CREATED, type: Cinema })
  async create(@Body() createCinemaDto: CreateCinemaDto) {
    try {
      return await this.cinemasService.create(createCinemaDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: API_SUMMARIES.GET_ALL_CINEMAS })
  @ApiResponse({ status: 200, description: API_DESCRIPTIONS.CINEMAS_LIST, type: [Cinema] })
  async findAll() {
    try {
      return await this.cinemasService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: API_SUMMARIES.GET_CINEMA_BY_ID })
  @ApiResponse({ status: 200, description: API_DESCRIPTIONS.CINEMA_FOUND, type: Cinema })
  async findOne(@Param('id') id: string) {
    try {
      return await this.cinemasService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: API_SUMMARIES.UPDATE_CINEMA })
  @ApiResponse({ status: 200, description: SUCCESS_MESSAGES.CINEMA_UPDATED, type: Cinema })
  async update(@Param('id') id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
    try {
      return await this.cinemasService.update(+id, updateCinemaDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: API_SUMMARIES.DELETE_CINEMA })
  @ApiResponse({ status: 200, description: SUCCESS_MESSAGES.CINEMA_DELETED })
  async remove(@Param('id') id: string) {
    try {
      await this.cinemasService.remove(+id);
      return { message: SUCCESS_MESSAGES.CINEMA_DELETED };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}