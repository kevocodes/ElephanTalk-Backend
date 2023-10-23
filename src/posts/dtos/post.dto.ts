import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  @MaxLength(60)
  title: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  description: string;

  @IsUrl()
  image: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class CommentPostDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  content: string;
}
