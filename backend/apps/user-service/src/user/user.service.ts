import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserStatus } from './enums/status.enum';
import { UserRole } from './enums/role.enum';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly redis: RedisService,
  ) {}

  // Hash the password with bcrypt and a pepper before saving the user
  async create(createUserDto: CreateUserDto) {
    const pepper = process.env.PEPPER;

    if (!pepper) {
      throw new Error('PEPPER environment variable is null');
    }

    const passwordHash = bcrypt.hashSync(createUserDto.password + pepper, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: passwordHash,
    });

    const createdUser = await this.userRepository.save(user);

    await this.invalidateUserCache();

    return createdUser;
  }

  async findAll() {
    const key = 'user:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as User[];
    }

    const users = await this.userRepository.find();

    await this.redis.set(key, JSON.stringify(users), 3600);

    return users;
  }

  async findOne(id: string) {
    const key = `user:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as User;
    }

    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      await this.redis.set(key, JSON.stringify(user), 3600);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const key = `user:email:${this.normalizeKey(email)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as User;
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      await this.redis.set(key, JSON.stringify(user), 3600);
    }

    return user;
  }

  async findOneByPhoneNumber(phoneNumber: string) {
    const key = `user:phone:${this.normalizeKey(phoneNumber)}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as User;
    }

    const user = await this.userRepository.findOne({ where: { phoneNumber } });

    if (user) {
      await this.redis.set(key, JSON.stringify(user), 3600);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, updateUserDto);

    await this.invalidateUserCache();

    return result;
  }

  async updateRole(id: string, role: UserRole) {
    const result = await this.userRepository.update(id, { role });

    await this.invalidateUserCache();

    return result;
  }

  async updateStatus(id: string, status: UserStatus) {
    const result = await this.userRepository.update(id, { status });

    await this.invalidateUserCache();

    return result;
  }

  async remove(id: string) {
    const result = await this.userRepository.update(id, {
      status: UserStatus.INACTIVE,
    });

    await this.invalidateUserCache();

    return result;
  }

  async reActivate(id: string) {
    const result = await this.userRepository.update(id, {
      status: UserStatus.ACTIVE,
    });

    await this.invalidateUserCache();

    return result;
  }

  private normalizeKey(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, '');
  }

  private async invalidateUserCache() {
    await this.redis.delPattern('user:*');
  }
}
