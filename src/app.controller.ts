import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @ApiOkResponse({
    description: 'Rota health',
    example: 'API funcionando!',
  })
  @Get()
  getHello() {
    return { message: 'API funcionando!' };
  }
}
