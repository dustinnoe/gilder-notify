import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('notifyme')
  notifyMe(@Body() body: any): string {
    return this.appService.notifyMe(body);
  }
}
