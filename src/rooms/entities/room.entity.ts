import { Amenity } from "src/amenities/entities/amenity.entity"
import { Comment } from "src/comments/entities/comment.entity"
import { Reservation } from "src/reservations/entities/reservation.entity"

@Entity({
    name: "rooms"
})
export class Room {

    @PrimaryGeneratedColumn("uuid")
    id: string = uuid("uuid")
    
    @Column({ type: "text"})
    description: string 

    @Column({})
    beds: number
    
    @Column()
    baths: number
    
    @Column()
    photos: string
    
    @Column()
    capacity: number
    
    @Column()
    peice: number
    
    @OneToMany( () => Reservation, (reservation) => reservation.room_)
    reservation: Reservation []
    
    @ManyToMany( () => Amenity, (amenity) => amenity.room_)
    amenities: Amenity[]

    @OneToMany( () => Comment, (comments) => comments.room_)
    comments_: Comment[]

}