import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  findAll() {
    return this.placesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placesService.findOne(Number(id));
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      address: string;
    },
  ) {
    return this.placesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      address?: string;
    },
  ) {
    return this.placesService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placesService.remove(Number(id));
  }
}
