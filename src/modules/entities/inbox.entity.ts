import {
  Entity,
  JoinColumn,
  ManyToOne,
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


  @ManyToOne(() => Comment, (comment) => comment.inbox)
  comment: Comment[];
}
