export class GetUserDto {
  id!: string;
  email!: string;
  username?: string;
  provider!: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  address?: string[];
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  birthDate?: string;
  avatarUrl?: string;
  lastLoginAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class GetUserByAdminDto {
  id!: string;
  email!: string;
  username?: string;
  provider!: 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
  firstName?: string;
  lastName?: string;
  fullName?: string;
  address?: string[];
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  birthDate?: string;
  avatarUrl?: string;
  roles!: string[];
  status!: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  tokenVersion!: number;
  lastLoginAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
