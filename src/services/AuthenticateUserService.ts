import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import auth from '../config/auth';

import User from '../models/User';

interface RequestDTO {
  email: string;
  password: string;
}

interface Response {
  user: User,
  token: string;
}

class AuthenticateUserService {
  public async execute({email, password}: RequestDTO): Promise<Response> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({
      where: { email }
    })

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    const passwordMathed = await compare(password, user.password)

    if (!passwordMathed) {
      throw new Error('Incorrect email/password combination.');
    }

    const { secret, expiresIn } = auth.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    })

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService
