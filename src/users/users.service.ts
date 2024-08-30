import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.enum';
import { RegisterAuthDto } from 'src/auth/dto/register-auth.dto';
import { Parking } from 'src/parkings/entities/parking.entity';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
  ) {}

  async createUser(partner: RegisterAuthDto): Promise<User> {
    const userExists = await this.userRepository.findOne({ where: { email: partner.email, role: Role.SOCIO} });
    
    if (userExists) {
      throw new ConflictException('Email is already registered');
    }

    partner.role = Role.SOCIO;
    return this.userRepository.save(partner);
  }

  async getParkingsByPartner(idUser: number): Promise<Parking[]> {
    const parkings = await this.parkingRepository.find({where: { user: { id: idUser } },
    });
    if (parkings.length === 0) {
      throw new NotFoundException(`User identified with ${idUser} not found.`);
    }
    return parkings;
  }

  async partners(){
    const partners = await this.userRepository.find({where: { role: Role.SOCIO}})
    return plainToInstance(GetUserDto, partners, {excludeExtraneousValues: true,});
  }

  async findByEmail(email: string) {
    const userExists = await this.userRepository.findOne({ where: { email} });
    return userExists;
  }

  findOne(id: number){
    return this.userRepository.findOne({ where: { id } });
  }
}
