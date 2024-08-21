import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './accounts.entity';

export enum Roll {
  ADMIM = 'admin',
  GUEST = 'guest',
  USER = 'user',
}

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: Roll.USER })
  roll: Roll;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 50, nullable: false })
  email: string;

  @Column({ length: 50, nullable: false })
  phone: number;

  @Column({ length: 50, nullable: false })
  password: string;

  @OneToMany(() => Account, (account) => account.user_)
  account: Account[];
}
