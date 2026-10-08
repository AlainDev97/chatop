import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Alain',
    description: 'Nom de l’utilisateur',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'alain@test.fr',
    description: 'Adresse email de l’utilisateur',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'MonMotDePasse123',
    description: 'Mot de passe de l’utilisateur',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
