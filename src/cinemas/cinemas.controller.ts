import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Cinema } from '../entities/cinema.entity';

@ApiTags('cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva sala de cine' })
  @ApiResponse({ status: 201, description: 'Sala creada exitosamente', type: Cinema })
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las salas de cine' })
  @ApiResponse({ status: 200, description: 'Lista de salas', type: [Cinema] })
  findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una sala por ID' })
  @ApiResponse({ status: 200, description: 'Sala encontrada', type: Cinema })
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una sala' })
  @ApiResponse({ status: 200, description: 'Sala actualizada', type: Cinema })
  update(@Param('id') id: string, @Body() updateCinemaDto: UpdateCinemaDto) {
    return this.cinemasService.update(+id, updateCinemaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una sala' })
  @ApiResponse({ status: 200, description: 'Sala eliminada' })
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(+id);
  }
}