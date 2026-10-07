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
}
