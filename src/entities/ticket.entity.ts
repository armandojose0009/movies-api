import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Showtime } from './showtime.entity';

@Entity('tickets')
export class Ticket {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  showtimeId: number;

  @ApiProperty()
  @Column()
  customerName: string;

  @ApiProperty()
  @Column()
  customerEmail: string;

  @ApiProperty()
  @Column()
  seatNumber: string;

  @ApiProperty()
  @CreateDateColumn()
  purchaseDate: Date;

  @ManyToOne(() => Showtime, showtime => showtime.tickets)
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;
}