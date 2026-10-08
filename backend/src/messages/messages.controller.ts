import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
    schema: {
      example: {
        message: 'Validation error',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token absent ou invalide',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }
}
