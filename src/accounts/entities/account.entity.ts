import { Comment } from "src/comments/entities/comment.entity"
import { Inbox } from "src/inbox/entities/inbox.entity"
import { Reservation } from "src/reservations/entities/reservation.entity"
import { User } from "src/users/entities/user.entity"

@Entity({
    name: "accounts"
})

export class Account {

    @PrimaryGeneratedColumn("uuid")
    id: string = uuid("uuid")

    @Column({ length: 50, nullable: false})
    photo: string

    @OneToMany( () => Comment, (comment) => comment.account_)
    comments_: Comment[]

    @OneToMany( () => Reservation, (reservation) => reservation.account_)
    reservatiom_: Reservation[]
    
    @ManytoOne( () => User, (user) => user.account_)
    user_: User

    @OneToOne( )
    inbox_: Inbox

}
