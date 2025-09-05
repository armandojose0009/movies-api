import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from '../entities/ticket.entity';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Comprar un ticket' })
  @ApiResponse({ status: 201, description: 'Ticket comprado exitosamente', type: Ticket })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tickets' })
  @ApiResponse({ status: 200, description: 'Lista de tickets', type: [Ticket] })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ticket por ID' })
  @ApiResponse({ status: 200, description: 'Ticket encontrado', type: Ticket })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Get('showtime/:showtimeId')
  @ApiOperation({ summary: 'Obtener tickets por función' })
  @ApiResponse({ status: 200, description: 'Lista de tickets de la función', type: [Ticket] })
  findByShowtime(@Param('showtimeId') showtimeId: string) {
    return this.ticketsService.findByShowtime(+showtimeId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar un ticket' })
  @ApiResponse({ status: 200, description: 'Ticket cancelado' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}