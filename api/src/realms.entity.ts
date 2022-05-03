import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm";

@Entity()
export class Realm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pubkey: string;

    @Column()
    owner: string;

    @Column()
    name: string;
}