import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './accounts.entity';
import { Comment } from './comments.entity';

@Entity({ name: 'inbox' })
export class Inbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Account, (account) => account.inbox)
  @JoinColumn()
  account: Account;

  @OneToMany(() => Comment, (comment) => comment.inbox)
  comment: Comment[];

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender: Account;

  @ManyToOne(() => Account, (account) => account.receivedMessages)
  @JoinColumn({ name: 'receiverId' })
  receiver: Account;
}


// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
// import { Account } from './accounts.entity';

// @Entity()
// export class Inbox {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   message: string;

//   @ManyToOne(() => Account, (account) => account.sentMessages)
//   sender: Account;

//   @ManyToOne(() => Account, (account) => account.receivedMessages)
//   receiver: Account;

//   @CreateDateColumn()
//   createdAt: Date;
// }

