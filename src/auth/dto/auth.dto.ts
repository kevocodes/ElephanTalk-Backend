import { IsOptional, IsString } from 'class-validator';

export class AuthInfoDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  password: string;
}
