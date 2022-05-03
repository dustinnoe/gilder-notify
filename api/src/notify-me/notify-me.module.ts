import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationSubscription } from "src/notificationSubscription.entity";
import { NotifyProposal } from "src/proposals.entity";
import { Realm } from "src/realms.entity"
import { NotifyMeController } from "./notify-me.controller";
import { NotifyMeService } from "./notify-me.service";
import config from '../../ormconfig';

@Module({
    imports: [
      TypeOrmModule.forRoot(config),
      TypeOrmModule.forFeature([NotificationSubscription, Realm, NotifyProposal])
    ],
    controllers: [NotifyMeController], 
    providers: [NotifyMeService]
})
export class notifyMeModule {

}