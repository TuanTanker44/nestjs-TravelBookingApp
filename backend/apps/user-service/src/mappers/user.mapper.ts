import { UserDocument } from '../../../schemas/user.schema';
import { GetUserByAdminDto } from '../dto/get_user.dto';
import { gender } from '../constants/gender.enum';
import { status } from '../constants/status.enum';

export function mapUserToResponse(user: UserDocument): GetUserByAdminDto {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    provider: user.provider,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName:
      user.firstName || user.lastName
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
        : undefined,
    address: user.address,
    gender: user.gender as gender,
    phone: user.phone,
    birthDate: user.birthDate,
    avatarUrl: user.avatarUrl,
    roles: user.roles,
    status: user.status as status,
    tokenVersion: user.tokenVersion,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
