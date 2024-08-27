import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/entities/user.entity';
import { TokenModule } from './token/token.module';
import { ParkingsModule } from './parkings/parkings.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehicleshistoryModule } from './vehicleshistory/vehicleshistory.module';
import { VehicleHistory } from './vehicleshistory/entities/vehicleshistory.entity';
import { Parking } from './parkings/entities/parking.entity';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { Token } from './token/entities/token.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'parking_nestjs',
      entities: [User, Parking, Vehicle, VehicleHistory, Token],
      synchronize: true,
    }),
    UsersModule,
    TokenModule,
    ParkingsModule,
    VehiclesModule,
    VehicleshistoryModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
