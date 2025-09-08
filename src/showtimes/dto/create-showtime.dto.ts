import { IsNumber, IsDateString, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateShowtimeDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  movieId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  cinemaId: number;

  @ApiProperty()
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  startTime: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
}
