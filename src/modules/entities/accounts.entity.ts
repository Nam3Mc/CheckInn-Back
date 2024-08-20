import { Comment } from './comments.entity';
import { Inbox } from './inbox.entity';
import { Reservation } from './reservations.entity';
import { User } from './users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'accounts',
})
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  photo: string;

  @OneToMany(() => Comment, (comment) => comment.account_)
  comments_: Comment[];

  @OneToMany(() => Reservation, (reservation) => reservation.account)
  reservation_: Reservation[];

  @ManyToOne(() => User, (user) => user.account_)
  user_: User;

  @OneToOne()
  inbox_: Inbox;
}
