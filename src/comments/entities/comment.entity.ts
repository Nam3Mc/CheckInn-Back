import { Account } from "src/accounts/entities/account.entity"
import { Room } from "src/rooms/entities/room.entity"

@Entity({
    name: "comments"
})

export class Comment {

    @PrimaryGeneratedColumn("uuid")
    id: string = uuid("uuid")
    
    @Column({ type: "text", nullable: false})
    description: string 

    @Column({ type: "Floar", nullable: false})
    rate: number

    @ManyToOne( () => Account, (account) => account.comments_)
    account_: Account
    
    @ManyToOne( () => Room, (room) => room.comments_)
    room_: Room
}
