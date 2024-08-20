import { Amenity } from "./amenities.entity"
import { Comment } from "./comments.entity"
import { Reservation } from "./reservations.entity"
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity({
    name: "rooms"
})
export class Room {

    @PrimaryGeneratedColumn("uuid")
    id: string
    
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
    
    @OneToMany( () => Reservation, (reservation) => reservation.room)
    reservation: Reservation []
    
    @ManyToMany( () => Amenity, (amenity) => amenity.room_)
    amenities: Amenity[]

    @OneToMany( () => Comment, (comments) => comments.room_)
    comments_: Comment[]

}