import { Account } from "src/accounts/entities/account.entity"
import { Room } from "src/rooms/entities/room.entity"

@Entity({
    name: "users"
})

export class Reservation {

    @PrimaryGeneratedColumn("uuid")
    id: string = uuid("uuid")

    @Column({ type: "float", nullable: false})
    price: number

    @Column()
    status: boolean

    @Column()
    checkin: Date

    @Column()
    checkout: Date

    @ManyToOne( () => Account, (account) => account.reservations_)
    account: Account

    @ManyToOne( () => Room, (room) => room.reservations_)
    room: Room

    @Column({ type: "int", default: 1})
    guests: number

}