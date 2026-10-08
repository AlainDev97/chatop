import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import type { AuthenticatedRequest } from './types/authenticated-request.type';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 200,
    description: 'Compte créé avec succès',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email déjà utilisé',
    schema: {
      example: {
        message: 'Email already exists',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Connecter un utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides',
    schema: {
      example: {
        message: 'Invalid credentials',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer l’utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur connecté',
    schema: {
      example: {
        id: 1,
        name: 'Alain',
        email: 'alain@test.fr',
        created_at: '2026-10-04T12:00:00.000Z',
        updated_at: '2026-10-04T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token absent ou invalide',
  })
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
