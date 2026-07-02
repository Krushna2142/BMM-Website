import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class ReorderSectionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  sectionIds: string[];
}
