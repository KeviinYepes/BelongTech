import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  async create(data: {
    email: string;
    name?: string;
    passwordHash: string;
    code?: string;
    isActive?: boolean;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(
    id: number,
    data: {
      email?: string;
      name?: string;
      passwordHash?: string;
      code?: string;
      isActive?: boolean;
    },
  ) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
