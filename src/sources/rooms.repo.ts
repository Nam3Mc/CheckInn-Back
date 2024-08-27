
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "src/modules/entities/reservations.entity";
import { Room } from "src/modules/entities/rooms.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomsRepository{
    constructor(
        @InjectRepository(Room)
        private readonly roomsRepository: Repository<Room>
    ){}
    
    async getRooms(): Promise<Room[]> {
        const rooms: Room[] = await this.roomsRepository.find()
        return rooms
    }

    async getRoomById(id: string): Promise<Room> {
        const room = await this.roomsRepository.findOneBy({id})
        return room
    }

    async roomCalendar(roomId: string, checkIn: Date, checkOut: Date ): Promise<boolean> {
        const room: Room = await this.roomsRepository.findOne({
          where: {id: roomId}
        })
        const reservations: Reservation[] = room.reservation
        for ( const book of reservations ) {
            if (checkIn >= book.checkin || checkIn < book.checkout || checkOut > book.checkin ) {
                return true
            } else {
                return false
            }
        }     
    }
}