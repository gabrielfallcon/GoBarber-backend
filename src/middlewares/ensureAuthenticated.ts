import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken';

import auth  from '../config/auth'

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing')
  }

  const [, token] = authHeader.split(' ');

  const { secret, expiresIn } = auth.jwt;

  try {
    const decoded = verify(token, secret);

    // Forçando uma variavel decoded a tipagem TokenPayload com "as"
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub
    }

    return next()
  } catch {
    throw new Error('Ivalid JWT token');
  }
}
