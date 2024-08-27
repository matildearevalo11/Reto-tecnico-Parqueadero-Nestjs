import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.enum';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(partner: RegisterAuthDto): Promise<User> {
    const userExists = await this.userRepository.findOne({ where: { email: partner.email, role: Role.SOCIO} });
    
    if (userExists) {
      throw new HttpException('El email ya está registrado', 409);
    }

    partner.role = Role.SOCIO;
    return this.userRepository.save(partner);
  }


  async findByEmail(email: string) {
    const userExists = await this.userRepository.findOne({ where: { email} });
    return userExists;
  }
}
