import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  findById(id: number) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  create(data: { name: string; email: string; password: string }) {
    return this.prisma.users.create({
      data,
    });
  }
}
