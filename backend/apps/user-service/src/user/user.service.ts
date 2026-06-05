import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserStatus } from './enums/status.enum';
import { UserRole } from './enums/role.enum';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(process.cwd(), 'apps/user-service/.env') });

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Hash the password with bcrypt and a pepper before saving the user
  create(createUserDto: CreateUserDto) {
    const passwordHash = bcrypt.hashSync(
      createUserDto.password + process.env.PEPPER,
      10,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: passwordHash,
    });
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findOneByPhoneNumber(phoneNumber: string) {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  updateRole(id: string, role: UserRole) {
    return this.userRepository.update(id, { role });
  }

  updateStatus(id: string, status: UserStatus) {
    return this.userRepository.update(id, { status });
  }

  remove(id: string) {
    return this.userRepository.update(id, { status: UserStatus.INACTIVE });
  }

  reActivate(id: string) {
    return this.userRepository.update(id, { status: UserStatus.ACTIVE });
  }
}
