import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'alain@test.fr',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'MonMotDePasse123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
