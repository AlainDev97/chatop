import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({
    summary: 'Envoyer un message pour une location',
  })
  @ApiBody({
    type: CreateMessageDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Message envoyé avec succès',
    schema: {
      example: {
        message: 'Message sent!',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur de validation',
  })
  @ApiResponse({
    status: 401,
    description: 'Token absent ou invalide',
  })
  create(@Body() dto: CreateMessageDto, @Req() req: AuthenticatedRequest) {
    return this.messagesService.create(dto, req.user.id);
  }
}
