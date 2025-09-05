import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Showtime } from './showtime.entity';

@Entity('cinemas')
export class Cinema {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  capacity: number;

  @OneToMany(() => Showtime, showtime => showtime.cinema)
  showtimes: Showtime[];
}