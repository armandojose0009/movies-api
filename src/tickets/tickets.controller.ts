import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from '../entities/ticket.entity';
import {
  SUCCESS_MESSAGES,
  API_SUMMARIES,
  API_DESCRIPTIONS,
} from '../common/constants/messages.constants';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: API_SUMMARIES.PURCHASE_TICKET })
  @ApiResponse({
    status: 201,
    description: SUCCESS_MESSAGES.TICKET_CREATED,
    type: Ticket,
  })
  async create(@Body() createTicketDto: CreateTicketDto) {
    try {
      return await this.ticketsService.create(createTicketDto);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: API_SUMMARIES.GET_ALL_TICKETS })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.TICKETS_LIST,
    type: [Ticket],
  })
  async findAll() {
    try {
      return await this.ticketsService.findAll();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: API_SUMMARIES.GET_TICKET_BY_ID })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.TICKET_FOUND,
    type: Ticket,
  })
  async findOne(@Param('id') id: string) {
    try {
      return await this.ticketsService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('showtime/:showtimeId')
  @ApiOperation({ summary: API_SUMMARIES.GET_TICKETS_BY_SHOWTIME })
  @ApiResponse({
    status: 200,
    description: API_DESCRIPTIONS.SHOWTIME_TICKETS_LIST,
    type: [Ticket],
  })
  async findByShowtime(@Param('showtimeId') showtimeId: string) {
    try {
      return await this.ticketsService.findByShowtime(+showtimeId);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: API_SUMMARIES.CANCEL_TICKET })
  @ApiResponse({ status: 200, description: SUCCESS_MESSAGES.TICKET_CANCELLED })
  async remove(@Param('id') id: string) {
    try {
      await this.ticketsService.remove(+id);
      return { message: SUCCESS_MESSAGES.TICKET_CANCELLED };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
