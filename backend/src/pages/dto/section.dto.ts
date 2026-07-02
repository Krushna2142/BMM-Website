import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  type: string;

  @IsNumber()
  order: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsObject()
  props: any;
}

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsObject()
  @IsOptional()
  props?: any;
}