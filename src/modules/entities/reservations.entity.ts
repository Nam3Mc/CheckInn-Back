import { Account } from './accounts.entity';
import { MercadoPago } from './mercadoPago.entity';
import { Room } from './rooms.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity({
  name: 'reservations',
})
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

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

  @Column({ type: 'boolean', default: false })
  hasMinor: boolean;

  @OneToOne(() => MercadoPago, (mercadoPago) => mercadoPago.reservation, {
    cascade: true, // Permite la eliminación en cascada
    onDelete: 'CASCADE', // Asegura que se eliminen las entradas en mercado_pago
  })
  @JoinColumn()
  payment: MercadoPago;
}
