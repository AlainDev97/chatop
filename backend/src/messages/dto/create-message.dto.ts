import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 1,
    description: 'Identifiant de la location',
  })
  @IsInt()
  @IsPositive()
  rental_id!: number;

  @ApiProperty({
    example: 1,
    description: 'Identifiant de l’utilisateur',
  })
  @IsInt()
  @IsPositive()
  user_id!: number;

  @ApiProperty({
    example: 'Bonjour, je suis intéressé par cette location.',
    description: 'Contenu du message',
  })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
