import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(60)
  title: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
