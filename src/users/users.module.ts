import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';

   @Module({
     imports: [TypeOrmModule.forFeature([User])],
     providers: [UserService],
     exports: [UserService],
     controllers: [UsersController],
})
export class UsersModule {}
