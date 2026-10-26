import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Lazer',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Cor da categoria',
    example: '#349BEB',
  })
  @IsNotEmpty()
  @IsString()
  color!: string;

  @ApiProperty({ description: 'Ícone da categoria' })
  @IsNotEmpty()
  @IsString()
  icon!: string;
}
