import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
