import { Injectable, Res, HttpStatus, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getRealms } from '@solana/spl-governance';
import { Connection, PublicKey } from '@solana/web3.js';
import { throws } from "assert";

import { NotificationSubscription } from "src/notificationSubscription.entity";
import { Realm } from "src/realms.entity";
import { Repository } from "typeorm";



@Injectable({})
export class NotifyMeService{
    constructor(
        @InjectRepository(NotificationSubscription) private notificationSubscriptionsRepository: Repository<NotificationSubscription>,
        @InjectRepository(Realm) private realmsRepository: Repository<Realm>
    ){

    }

    getAll(): Promise<NotificationSubscription[]> {
        return this.notificationSubscriptionsRepository.find(); // SELECT * FROM notificationSubscriptions;
    }

    getOneById(id: number): Promise<NotificationSubscription>{
        return this.notificationSubscriptionsRepository.findOneOrFail(id) // SELECT * FROM notificationSubscriptions WHERE id = ?;
    }

    async notifyMe(body: any): Promise<any> {
        if(body.unsubscribe == undefined) body.unsubscribe = false;
        // Validate input
        if(
            body.type != "newProposals" ||
            !body.mobileToken.match(/^[0-9A-Za-z\[\]]*$/) ||
            !body.realm.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/) ||
            typeof body.unsubscribe != 'boolean'
        ){
            return 'Bad Request';
        }

        // Check if subscription already exists
        let existing = await this.notificationSubscriptionsRepository.findOne({
            where: {type: "newProposals", mobileToken: body.mobileToken, realm: body.realm}
        })

        if(existing && body.unsubscribe){
            try {
                await this.notificationSubscriptionsRepository.remove(existing);
                return 'Unsubscribed';
            }
            catch(err){
                console.log(err);
                return 'Unsubscribe request failed'
            }
        }

        if(existing) return 'Already subscribed.';
        
        // Check if realm is already tracked and add to realm table if not
        let realmTracked = await this.realmsRepository.findOne({
            where: { pubkey: body.realm }
        })
        if(!realmTracked){
            this.realmsRepository.save({
                pubkey: body.realm
            })
        }
        
        const newNotificationSubscription = this.notificationSubscriptionsRepository.create({
            mobileToken: body.mobileToken,
            deviceType: 'iOS',
            isActive: true,
            type: 'newProposals',
            realm: body.realm
        })

        return await this.notificationSubscriptionsRepository.save(newNotificationSubscription);
      }

      getDeviceSubscriptions(body: any): any {
        return this.notificationSubscriptionsRepository.find({
            select: ["type", "realm"],
            where: { mobileToken: body.mobileToken }
        });
      }
}