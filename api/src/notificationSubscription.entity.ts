import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NotificationSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mobileToken: string;

    @Column()
    deviceType: string;

    @Column()
    subscriptionType: string;

    @Column()
    pubkeySubscribe: string;

    @Column()
    isActive: boolean;
}