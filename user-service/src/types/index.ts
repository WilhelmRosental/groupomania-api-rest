import { FastifyRequest, FastifyReply } from 'fastify';

export interface JwtPayload {
  userId: number;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface UserPayload {
  id: number;
  isAdmin: boolean;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: UserPayload;
}

export interface UserSignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLoginBody {
  email: string;
  password: string;
}

export interface UserUpdateBody {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
