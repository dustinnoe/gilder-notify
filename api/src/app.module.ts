import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { notifyMeModule } from './notify-me/notify-me.module';
import config from '../ormconfig';
import { NotificationSubscription } from './notificationSubscription.entity';
import { Realm } from './realms.entity';
import { NotifyProposal } from './proposals.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([NotificationSubscription, Realm, NotifyProposal]),
    notifyMeModule
  ]
})
export class AppModule {}
