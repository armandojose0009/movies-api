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
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from '../entities/showtime.entity';
import {
  SUCCESS_MESSAGES,
  API_SUMMARIES,
  API_DESCRIPTIONS,
} from '../common/constants/messages.constants';

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @ApiOperation({ summary: API_SUMMARIES.CREATE_SHOWTIME })
  @ApiResponse({
    status: 201,
    description: SUCCESS_MESSAGES.SHOWTIME_CREATED,
    type: Showtime,
  })
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    try {
      return await this.showtimesService.create(createShowtimeDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: API_SUMMARIES.GET_ALL_SHOWTIMES })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.SHOWTIMES_LIST,
    type: [Showtime],
  })
  async findAll() {
    try {
      return await this.showtimesService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: API_SUMMARIES.GET_SHOWTIME_BY_ID })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.SHOWTIME_FOUND,
    type: Showtime,
  })
  async findOne(@Param('id') id: string) {
    try {
      return await this.showtimesService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/available-seats')
  @ApiOperation({ summary: API_SUMMARIES.GET_AVAILABLE_SEATS })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.AVAILABLE_SEATS_COUNT,
  })
  async getAvailableSeats(@Param('id') id: string) {
    try {
      const availableSeats = await this.showtimesService.getAvailableSeats(+id);
      return { availableSeats };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: API_SUMMARIES.UPDATE_SHOWTIME })
  @ApiResponse({
    status: 200,
    description: SUCCESS_MESSAGES.SHOWTIME_UPDATED,
    type: Showtime,
  })
  async update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    try {
      return await this.showtimesService.update(+id, updateShowtimeDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: API_SUMMARIES.DELETE_SHOWTIME })
  @ApiResponse({ status: 200, description: SUCCESS_MESSAGES.SHOWTIME_DELETED })
  async remove(@Param('id') id: string) {
    try {
      await this.showtimesService.remove(+id);
      return { message: SUCCESS_MESSAGES.SHOWTIME_DELETED };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
