import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NotifyProposal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    realmPubkey: string;

    @Column()
    name: string;

    @Column()
    descriptionLink: string;

    @Column()
    label: string;

    @Column()
    draftAt: number;
}