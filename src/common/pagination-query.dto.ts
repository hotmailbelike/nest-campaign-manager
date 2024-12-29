import { IsString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  take?: string = '10';
}
