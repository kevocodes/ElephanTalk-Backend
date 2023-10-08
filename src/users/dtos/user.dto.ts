import { OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/models/roles.model';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(4)
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsEnum(Role)
  @IsOptional()
  readonly role: Role;

  @IsString()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {}

export class UpdateUserRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role;
}
