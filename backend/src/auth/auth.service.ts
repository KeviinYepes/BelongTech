import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new UnauthorizedException('Email o password incompletos.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tu usuario esta inactivo.');
    }

    if (user.passwordHash !== normalizedPassword) {
      throw new UnauthorizedException('Password incorrecto.');
    }

    return {
      message: 'Login correcto',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        code: user.code,
      },
    };
  }
}
