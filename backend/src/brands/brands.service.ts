import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Marca no encontrada.');
    }

    return brand;
  }

  async create(data: { name: string; status?: boolean }) {
    return this.prisma.brand.create({
      data,
    });
  }

  async update(id: number, data: { name?: string; status?: boolean }) {
    await this.findOne(id);

    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
