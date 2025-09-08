import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from '../entities/ticket.entity';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), ShowtimesModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
