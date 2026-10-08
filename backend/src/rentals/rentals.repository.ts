import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.rentals.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.rentals.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  create(data: {
    name: string;
    surface: number;
    price: number;
    picture: string;
    description: string;
    ownerId: number;
  }) {
    return this.prisma.rentals.create({
      data: {
        name: data.name,
        surface: data.surface,
        price: data.price,
        picture: data.picture,
        description: data.description,
        owner_id: data.ownerId,
      },
    });
  }

  update(
    id: number,
    data: {
      name?: string;
      surface?: number;
      price?: number;
      picture?: string;
      description?: string;
    },
  ) {
    return this.prisma.rentals.update({
      where: { id },
      data,
    });
  }
}
