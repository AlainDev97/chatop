import { Injectable, NotFoundException } from '@nestjs/common';
import { RentalsRepository } from './rentals.repository';
import type { CreateRentalDto } from './dto/create-rental.dto';

@Injectable()
export class RentalsService {
  constructor(private readonly rentalsRepository: RentalsRepository) {}

  async findAll() {
    const rentals = await this.rentalsRepository.findAll();

    return {
      rentals: rentals.map((rental) => ({
        id: rental.id,
        name: rental.name,
        surface: Number(rental.surface),
        price: Number(rental.price),
        picture: rental.picture,
        description: rental.description,

        owner: {
          id: rental.users.id,
          name: rental.users.name,
        },

        created_at: rental.created_at,
        updated_at: rental.updated_at,
      })),
    };
  }

  async findById(id: number) {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    return {
      id: rental.id,
      name: rental.name,
      surface: Number(rental.surface),
      price: Number(rental.price),
      picture: rental.picture,
      description: rental.description,
      owner: {
        id: rental.users.id,
        name: rental.users.name,
      },
      created_at: rental.created_at,
      updated_at: rental.updated_at,
    };
  }

  async create(
    dto: CreateRentalDto,
    file: Express.Multer.File,
    ownerId: number,
  ) {
    const pictureUrl = `http://localhost:3001/uploads/${file.filename}`;

    await this.rentalsRepository.create({
      name: dto.name,
      surface: dto.surface,
      price: dto.price,
      picture: pictureUrl,
      description: dto.description,
      ownerId,
    });

    return {
      message: 'Rental created!',
    };
  }
}
