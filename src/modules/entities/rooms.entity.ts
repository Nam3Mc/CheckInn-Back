import { Amenity } from './amenities.entity';
import { Comment } from './comments.entity';
import { Reservation } from './reservations.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CANCELLED = 'cancelled',
}

@Entity({
  name: 'rooms',
})
@Unique(['name'])
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  beds: number;

  @Column()
  baths: number;

  @Column()
  photos: string;

  @Column()
  capacity: number;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservation: Reservation[];

  @ManyToMany(() => Amenity, (amenity) => amenity.room)
  amenities: Amenity[];

  @OneToMany(() => Comment, (comments) => comments.room)
  comments: Comment[];
}
