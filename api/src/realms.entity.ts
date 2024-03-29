import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from "typeorm";

@Entity()
export class Realm {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    pubkey!: string;

    @Column({
        type: "text",
        nullable: true
    })
    owner!: string;

    @Column({
        type: "text",
        nullable: true
    })
    name!: string;
}