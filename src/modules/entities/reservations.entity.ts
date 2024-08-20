import { Account } from './accounts.entity';
import { Room } from './rooms.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'users',
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column()
  status: boolean;

  @Column()
  checkin: Date;

  @Column()
  checkout: Date;

  @ManyToOne(() => Account, (account) => account.reservation_)
  account: Account;

  @ManyToOne(() => Room, (room) => room.reservation)
  room: Room;

  @Column({ type: 'int', default: 1 })
  guests: number;
}
