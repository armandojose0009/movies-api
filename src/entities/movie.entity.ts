import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Showtime } from './showtime.entity';

@Entity('movies')
export class Movie {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column()
  duration: number; // en minutos

  @ApiProperty()
  @Column()
  genre: string;

  @ApiProperty()
  @Column()
  rating: string;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes: Showtime[];
}