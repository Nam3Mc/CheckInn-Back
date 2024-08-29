import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './accounts.entity';
import { Room } from './rooms.entity';
import { Inbox } from './inbox.entity';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'float', nullable: false })
  rate: number;

  @ManyToOne(() => Account, (account) => account.comments)
  account: Account;

  @ManyToOne(() => Room, (room) => room.comments)
  room: Room;

  @OneToMany(() => Inbox, (inbox) => inbox.comment)
  inbox: Inbox;
}
