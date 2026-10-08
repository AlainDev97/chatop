import { BadRequestException, Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async create(dto: CreateMessageDto, authenticatedUserId: number) {
    try {
      await this.messagesRepository.create({
        rentalId: dto.rental_id,
        userId: authenticatedUserId,
        message: dto.message,
      });

      return {
        message: 'Message sent!',
      };
    } catch {
      throw new BadRequestException('Validation error');
    }
  }
}
