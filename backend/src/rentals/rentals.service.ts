import { Injectable, NotFoundException } from '@nestjs/common';
import { RentalsRepository } from './rentals.repository';

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
}
