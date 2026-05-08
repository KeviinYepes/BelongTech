import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(Number(id));
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      status?: boolean;
    },
  ) {
    return this.brandsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      status?: boolean;
    },
  ) {
    return this.brandsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(Number(id));
  }
}
