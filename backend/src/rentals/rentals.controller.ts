import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
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
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findById(id);
  }

  @Post()
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
}
