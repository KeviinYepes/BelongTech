import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.place.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const place = await this.prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      throw new NotFoundException('Sede no encontrada.');
    }

    return place;
  }

  async create(data: { name: string; address: string }) {
    return this.prisma.place.create({
      data,
    });
  }

  async update(id: number, data: { name?: string; address?: string }) {
    await this.findOne(id);

    return this.prisma.place.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.place.delete({
      where: { id },
    });
  }
}
