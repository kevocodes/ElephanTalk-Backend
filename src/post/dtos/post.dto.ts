import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  @MaxLength(60)
  title: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(8)
  description: string;

  @IsUrl()
  image: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
