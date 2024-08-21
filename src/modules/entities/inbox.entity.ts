import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./accounts.entity";
import { Comment } from "./comments.entity";

@Entity({name:'inbox'})
export class Inbox {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Relación uno a uno con la entidad Account.
    // Un Inbox pertenece a un solo Account y un Account tiene un solo Inbox.
    @OneToOne(() => Account, (account) => account.inbox)
    account: Account;

    // Relación muchos a uno con la entidad Comment.
    // Muchos Inbox pueden estar asociados con un único Comment.
    @ManyToOne(() => Comment, (comment) => comment.inbox)
    comment: Comment[];
}