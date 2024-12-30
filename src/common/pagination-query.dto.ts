import { IsOptional, IsEnum, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsEnum(['next', 'previous'])
  direction?: 'next' | 'previous' = 'next';

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
