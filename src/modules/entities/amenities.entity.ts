import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./rooms.entity";

@Entity({
    name: "amenities",
})
export class Amenity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: "boolean", nullable: false})
    heater: boolean;

    @Column({type: "boolean", nullable: false})
    airConditioner: boolean;

    @ManyToMany(()=>Room,(room)=>room.amenities)
    room:Room
}