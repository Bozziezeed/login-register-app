import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repouser: Repository<User>,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.repouser.save(data);
  }

  async findOne(condition: any): Promise<User> {
    return this.repouser.findOne({ where: condition });
  }
}
