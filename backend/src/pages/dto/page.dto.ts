import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { PageStatus } from '../../generated/prisma/client';

export class CreatePageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase alphanumeric with hyphens only',
  })
  slug: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(PageStatus)
  @IsOptional()
  status?: PageStatus;

  // SEO fields
  @IsString()
  @IsOptional()
  @MaxLength(200)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  seoDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];
}

export class UpdatePageDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(PageStatus)
  @IsOptional()
  status?: PageStatus;

  // SEO fields
  @IsString()
  @IsOptional()
  @MaxLength(200)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  seoDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];
}
