import { Request } from 'express';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
