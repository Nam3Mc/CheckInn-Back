import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './accounts.entity';

export enum Roll {
  ADMIN = 'admin',
  GUEST = 'guest',
  USER = 'user',
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Se genera automáticamente

  @Column({ type: 'enum', enum: Roll, default: Roll.GUEST })
  roll: Roll;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({unique:true, length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  phone: number;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];
}
