import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PlacesModule } from './places/places.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [AuthModule, PrismaModule, DevicesModule, UsersModule, CategoriesModule, PlacesModule, BrandsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
