import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './accounts.entity';
import { Room } from './rooms.entity';

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

  @ManyToOne(() => Account, (account) => account.comments_)
  account_: Account;

  @ManyToOne(() => Room, (room) => room.comments_)
  room_: Room;
}
