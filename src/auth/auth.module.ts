import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/token/entities/token.entity';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),   
    TypeOrmModule.forFeature([Token]),   
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
