import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { rentalId: number; userId: number; message: string }) {
    return this.prisma.messages.create({
      data: {
        rental_id: data.rentalId,
        user_id: data.userId,
        message: data.message,
      },
    });
  }
}
