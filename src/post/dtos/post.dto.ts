import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(8)
  @MaxLength(60)
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(8)
  description: string;

  @IsUrl()
  image: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class CommentPostDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(8)
  content: string;
}
