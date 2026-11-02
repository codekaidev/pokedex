import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  //? se puede usar tambien `@Transform(({ value }) => Number(value))` para personalizar las transformaciones, pero con `@Type(() => Number)` en nuestro ejercicio es suficiente
  offset?: number;
}
