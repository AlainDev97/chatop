import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  surface!: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
