import { Comment } from './comments.entity';
import { Inbox } from './inbox.entity';
import { Reservation } from './reservations.entity';
import { User } from './users.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ nullable: false, default: 'default-photo-url.jpg' })
  photo: string;

  // Relación uno a muchos con la entidad Comment.
  // Un Account puede tener múltiples comentarios asociados.
  @OneToMany(() => Comment, (comment) => comment.account)
  comments: Comment[];

  // Relación uno a muchos con la entidad Reservation.
  // Un Account puede tener múltiples reservas asociadas.
  @OneToMany(() => Reservation, (reservation) => reservation.account)
  reservation_: Reservation[];

  // Relación muchos a uno con la entidad User.
  // Muchos Accounts pueden estar asociados a un solo User.
  @ManyToOne(() => User, (user) => user.accounts)
  user: User;

  // Relación uno a uno con la entidad Inbox.
  // Un Account tiene un solo Inbox y un Inbox pertenece a un solo Account.
  @OneToOne(() => Inbox, (inbox) => inbox.account, {
    cascade: true,
  })
  @JoinColumn()
  inbox: Inbox;

  // Relación uno a muchos para los mensajes enviados.
  // Un Account puede enviar múltiples mensajes.
  @OneToMany(() => Inbox, (inbox) => inbox.sender)
  sentMessages: Inbox[];

  // Relación uno a muchos para los mensajes recibidos.
  // Un Account puede recibir múltiples mensajes.
  @OneToMany(() => Inbox, (inbox) => inbox.receiver)
  receivedMessages: Inbox[];
}
