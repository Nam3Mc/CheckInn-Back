import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MercadoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  paymentId: string;

  @Column()
  status: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  method: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
