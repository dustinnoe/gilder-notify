import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm";

@Entity()
export class Realm {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    pubkey!: string;

    @Column("text")
    owner!: string;

    @Column("text")
    name!: string;
}