import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Rentals')
@ApiBearerAuth()
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les locations',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des locations récupérée avec succès',
    schema: {
      example: {
        rentals: [
          {
            id: 1,
            name: 'Appartement Paris',
            surface: 50,
            price: 1200,
            picture: 'http://localhost:3001/uploads/example.jpg',
            description: 'Bel appartement au coeur de Paris',
            owner: {
              id: 1,
              name: 'Alain',
            },
            created_at: '2026-10-08T12:00:00.000Z',
            updated_at: '2026-10-08T12:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token absent ou invalide',
  })
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une location par son ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Identifiant de la location',
  })
  @ApiResponse({
    status: 200,
    description: 'Location trouvée',
    schema: {
      example: {
        id: 1,
        name: 'Appartement Paris',
        surface: 50,
        price: 1200,
        picture: 'http://localhost:3001/uploads/example.jpg',
        description: 'Bel appartement au coeur de Paris',
        owner: {
          id: 1,
          name: 'Alain',
        },
        created_at: '2026-10-08T12:00:00.000Z',
        updated_at: '2026-10-08T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Location introuvable',
    schema: {
      example: {
        message: 'Rental not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle location',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'surface', 'price', 'picture', 'description'],
      properties: {
        name: {
          type: 'string',
          example: 'Appartement Paris',
        },
        surface: {
          type: 'number',
          example: 50,
        },
        price: {
          type: 'number',
          example: 1200,
        },
        picture: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
          example: 'Bel appartement au coeur de Paris',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Location créée avec succès',
    schema: {
      example: {
        message: 'Rental created!',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
    schema: {
      example: {
        message: 'Validation error',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateRentalDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Validation error');
    }

    return this.rentalsService.create(dto, file, req.user.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Modifier une location',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Identifiant de la location',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Appartement modifié',
        },
        surface: {
          type: 'number',
          example: 60,
        },
        price: {
          type: 'number',
          example: 1350,
        },
        picture: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
          example: 'Nouvelle description',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Location modifiée avec succès',
    schema: {
      example: {
        message: 'Rental updated!',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Location introuvable',
    schema: {
      example: {
        message: 'Rental not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRentalDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.rentalsService.update(id, dto, file);
  }
}
