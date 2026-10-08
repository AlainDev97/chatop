import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par son ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Identifiant de l’utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
    schema: {
      example: {
        id: 1,
        name: 'Alain',
        email: 'alain@test.fr',
        created_at: '2026-10-04T12:00:00.000Z',
        updated_at: '2026-10-04T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token absent ou invalide',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur introuvable',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}
