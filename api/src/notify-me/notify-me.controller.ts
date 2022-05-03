import { Body, Controller, Post} from '@nestjs/common';
import { NotifyMeService } from './notify-me.service';

@Controller('notifyMe')
export class NotifyMeController {
    constructor(private notifyMeService: NotifyMeService) {}

    @Post()
    notifyMe(@Body() body: any): any {
        console.log(body)
        return this.notifyMeService.notifyMe(body);
    }
}
