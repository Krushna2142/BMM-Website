import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
  IsISO8601,
  Min,
} from 'class-validator';

export class CreateSectionDto {
  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  order?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsObject()
  props: Record<string, any>;

  @IsObject()
  @IsOptional()
  mobileProps?: Record<string, any>;

  @IsObject()
  @IsOptional()
  customStyles?: Record<string, any>;

  @IsISO8601()
  @IsOptional()
  publishStartAt?: string;

  @IsISO8601()
  @IsOptional()
  publishEndAt?: string;
}

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  order?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsObject()
  @IsOptional()
  props?: Record<string, any>;

  @IsObject()
  @IsOptional()
  mobileProps?: Record<string, any>;

  @IsObject()
  @IsOptional()
  customStyles?: Record<string, any>;

  @IsISO8601()
  @IsOptional()
  publishStartAt?: string;

  @IsISO8601()
  @IsOptional()
  publishEndAt?: string;
}
