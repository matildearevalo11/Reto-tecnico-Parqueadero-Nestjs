import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async saveToken(token: string, expiration: Date): Promise<Token> {
    const newToken = this.tokenRepository.create({ token, expiration });
    return this.tokenRepository.save(newToken);
  }

  async removeToken(token: string): Promise<void> {
    await this.tokenRepository.delete({ token });
  }

  async removeExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.tokenRepository.delete({ expiration: LessThan(now) });
  }
}
