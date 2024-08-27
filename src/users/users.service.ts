import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.enum';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { ConflictException } from 'src/exceptions/conflict.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(partner: RegisterAuthDto): Promise<User> {
    const userExists = await this.userRepository.findOne({ where: { email: partner.email, role: Role.SOCIO} });
    
    if (userExists) {
      throw new ConflictException('El email ya está registrado');
    }

    partner.role = Role.SOCIO;
    return this.userRepository.save(partner);
  }


  async findByEmail(email: string) {
    const userExists = await this.userRepository.findOne({ where: { email} });
    return userExists;
  }

  findOne(id: number){
    return this.userRepository.findOne({ where: { id } });
  }
}
