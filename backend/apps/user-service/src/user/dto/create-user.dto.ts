import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/)
  password!: string;

  @IsString()
  fullName!: string;

  @IsString()
  @IsOptional()
  phoneNumber!: string;

  @IsString()
  @IsOptional()
  avatarUrl!: string;
}
