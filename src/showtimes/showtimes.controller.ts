import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from '../entities/showtime.entity';

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva función' })
  @ApiResponse({ status: 201, description: 'Función creada exitosamente', type: Showtime })
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las funciones' })
  @ApiResponse({ status: 200, description: 'Lista de funciones', type: [Showtime] })
  findAll() {
    return this.showtimesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una función por ID' })
  @ApiResponse({ status: 200, description: 'Función encontrada', type: Showtime })
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  @Get(':id/available-seats')
  @ApiOperation({ summary: 'Obtener asientos disponibles para una función' })
  @ApiResponse({ status: 200, description: 'Número de asientos disponibles' })
  getAvailableSeats(@Param('id') id: string) {
    return this.showtimesService.getAvailableSeats(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una función' })
  @ApiResponse({ status: 200, description: 'Función actualizada', type: Showtime })
  update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto) {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una función' })
  @ApiResponse({ status: 200, description: 'Función eliminada' })
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(+id);
  }
}