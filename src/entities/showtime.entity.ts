import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Movie } from './movie.entity';
import { Cinema } from './cinema.entity';
import { Ticket } from './ticket.entity';

@Entity('showtimes')
export class Showtime {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  movieId: number;

  @ApiProperty()
  @Column()
  cinemaId: number;

  @ApiProperty()
  @Column('timestamp')
  startTime: Date;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Movie, movie => movie.showtimes)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @ManyToOne(() => Cinema, cinema => cinema.showtimes)
  @JoinColumn({ name: 'cinemaId' })
  cinema: Cinema;

  @OneToMany(() => Ticket, ticket => ticket.showtime)
  tickets: Ticket[];
}