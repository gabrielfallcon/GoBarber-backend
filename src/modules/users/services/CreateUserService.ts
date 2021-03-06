import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
  updated_at: Date;
}

class CreateUserService {
  public async execute({name, email, password}: Omit<RequestDTO, 'updated_at'>): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email }
    })

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService
