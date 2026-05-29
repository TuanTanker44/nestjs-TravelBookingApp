import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { mapUserToResponse } from './mappers/user.mapper';
import { Role } from '../auth/enums/role.enum';
import { UpdateUserDto } from './dto/update.dto';

interface RegisterUserData {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(data: RegisterUserData) {
    const exists = await this.userRepository.getByEmail(data.email);
    if (exists) {
      throw new ConflictException(`Email ${data.email} already exists`);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create({
      email: data.email,
      passwordHash,
      roles: [Role.user],
    });
    return mapUserToResponse(newUser);
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User with email ${email} not found`);
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return mapUserToResponse(user);
  }

  async getAllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users.map((user) => mapUserToResponse(user));
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return mapUserToResponse(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return mapUserToResponse(user);
  }

  async updateRoles(id: string, roles: string[]) {
    const updatedUser = await this.userRepository.updateRoles(id, roles);

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return mapUserToResponse(updatedUser);
  }

  async updateStatus(id: string, status: string) {
    const updatedUser = await this.userRepository.updateById(id, { status });

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return mapUserToResponse(updatedUser);
  }

  async updatePassword(id: string, newPassword: string) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.userRepository.updateById(id, {
      passwordHash,
      tokenVersion: user.tokenVersion + 1, // Invalidate existing tokens
    });

    if (!updatedUser) {
      throw new NotFoundException(
        `User with id ${id} failure in updating password`,
      );
    }
    return mapUserToResponse(updatedUser);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = await this.userRepository.updateById(id, data);

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} update failed`);
    }
    return mapUserToResponse(updatedUser);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.deleteById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return mapUserToResponse(user);
  }
}
