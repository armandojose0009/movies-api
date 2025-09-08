import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from '../entities/movie.entity';
import {
  SUCCESS_MESSAGES,
  API_SUMMARIES,
  API_DESCRIPTIONS,
} from '../common/constants/messages.constants';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: API_SUMMARIES.CREATE_MOVIE })
  @ApiResponse({
    status: 201,
    description: SUCCESS_MESSAGES.MOVIE_CREATED,
    type: Movie,
  })
  async create(@Body() createMovieDto: CreateMovieDto) {
    try {
      return await this.moviesService.create(createMovieDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: API_SUMMARIES.GET_ALL_MOVIES })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.MOVIES_LIST,
    type: [Movie],
  })
  async findAll() {
    try {
      return await this.moviesService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: API_SUMMARIES.GET_MOVIE_BY_ID })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.MOVIE_FOUND,
    type: Movie,
  })
  async findOne(@Param('id') id: string) {
    try {
      return await this.moviesService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: API_SUMMARIES.UPDATE_MOVIE })
  @ApiResponse({
    status: 200,
    description: SUCCESS_MESSAGES.MOVIE_UPDATED,
    type: Movie,
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    try {
      return await this.moviesService.update(+id, updateMovieDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: API_SUMMARIES.DELETE_MOVIE })
  @ApiResponse({ status: 200, description: SUCCESS_MESSAGES.MOVIE_DELETED })
  async remove(@Param('id') id: string) {
    try {
      await this.moviesService.remove(+id);
      return { message: SUCCESS_MESSAGES.MOVIE_DELETED };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
