import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Post,
} from '@nestjs/common';
import { TestRequest, TestResponse } from '@lib/type';

@Controller()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck(): string {
    return 'Server works';
  }

  @Post()
  test(@Body() req: TestRequest): TestResponse {
    return { response: req.body + '_serverUpdate' };
  }
}
