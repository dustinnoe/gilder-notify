import { Injectable, Res, HttpStatus, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationSubscription } from "src/notificationSubscription.entity";
import { Repository } from "typeorm";

@Injectable({})
export class NotifyMeService{
    constructor(@InjectRepository(NotificationSubscription) private notificationSubscriptionsRepository: Repository<NotificationSubscription>){

    }

    getAll(): Promise<NotificationSubscription[]> {
        return this.notificationSubscriptionsRepository.find(); // SELECT * FROM notificationSubscriptions;
    }

    getOneById(id: number): Promise<NotificationSubscription>{
        return this.notificationSubscriptionsRepository.findOneOrFail(id) // SELECT * FROM notificationSubscriptions WHERE id = ?;
    }

    notifyMe(body: any): any {
        // Validate input
        // if(
        //     body.subscriptionType != "newProposals" ||
        //     !body.mobileToken.match(/^[0-9A-Za-z\[\]]*$/) ||
        //     !body.pubkeySubscribe.match(/^[1-9A-HJ-MP-Za-km-z]{44}$/)
        // ){
        //     res.status(HttpStatus.BAD_REQUEST).send();
        //     return;
        // }
        // db.prepare(
        //   "INSERT INTO notification_subscription (device_token, subscription_type, pubkey_subscribe) VALUES (?, ?, ?)"
        // ).run(
        //   body.mobileToken,
        //   body.subscriptionType,
        //   body.pubkeySubscribe
        // )
        // console.log(body.method)
        console.log(body)
        const newNotificationSubscription = this.notificationSubscriptionsRepository.create({
            mobileToken: body.mobileToken,
            deviceType: 'iOS',
            isActive: true,
            subscriptionType: 'newProposals',
            pubkeySubscribe: body.pubkeySubscribe
        })

        this.notificationSubscriptionsRepository.save(newNotificationSubscription);
        return 'hi';
      }
}