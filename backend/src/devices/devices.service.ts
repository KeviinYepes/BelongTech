import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {} //instancia de PrismaService

  private readonly deviceRelations = {
    brand: {
      select: {
        id: true,
        name: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    place: {
      select: {
        id: true,
        name: true,
      },
    },
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  } as const;

  async findAll() {
    return this.prisma.device.findMany({
      include: this.deviceRelations,
      orderBy: { id: 'asc' },
    });  //this.prisma.device.findmany() = SELECT * FROM divce
  }

  async findOne(id: number) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: this.deviceRelations,
    });

    if (!device) {
      throw new NotFoundException('Dispositivo no encontrado.');
    }

    return device;
  }

  async create(data:{
    name: string;
    serial: string;
    model?: string;
    description?: string;
    purchaseDate: Date;
    assignedAt: Date;
    brandId: number;
    categoryId: number;
    placeId: number;
    userId?: number;
    code?: string;
    enum?: string;
  }) {
    return this.prisma.device.create({ //this.prisma.device.create is an INSERT INTO device
        data,
        include: this.deviceRelations,
    });
  }

  async update(
    id: number,
    data:{
        name?: string;
        serial?: string;
        model?: string;
        description?: string;
        purchaseDate?: Date;
        assignedAt?: Date;
        brandId?: number;
        categoryId?: number;
        placeId?: number;
        userId?: number | null;
        code?: string;
        enum?: string;
  }) {
    await this.findOne(id);

    return this.prisma.device.update({
        where: {id },
        data,
        include: this.deviceRelations,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.device.delete({
      where: { id },
    });
  }
}
