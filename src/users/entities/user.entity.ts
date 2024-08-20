import { Account } from "src/accounts/entities/account.entity"

export enum Roll {
    ADMIM = "admin",
    GUEST = "guest",
    USER = "user"
}

@Entity({
    name: "users"
})

export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string = uuid("uuid")

    @Column({ default: Roll.USER })
    roll: Roll

    @Column({ length: 50, nullable: false})
    name: string

    @Column({ length: 50, nullable: false})
    email: string

    @Column({ length: 50, nullable: false})
    phone: number
    
    @Column({ length: 50, nullable: false})
    password: string

    @OneToMany( () => Account, (account) => account.user_)
    account_ : Account []

}