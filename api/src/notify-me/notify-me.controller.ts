import { Body, Controller, Post} from '@nestjs/common';
import { NotifyMeService } from './notify-me.service';

@Controller('notifyMe')
export class NotifyMeController {
    constructor(private notifyMeService: NotifyMeService) {}

    @Post()
    async notifyMe(@Body() body: any): Promise<any> {
        return await this.notifyMeService.notifyMe(body);
    }

    @Post('listSubscriptions')
    getDeviceSubscriptions(@Body() body: any): any {
        return this.notifyMeService.getDeviceSubscriptions(body);
    }
}
