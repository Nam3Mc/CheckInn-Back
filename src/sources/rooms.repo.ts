
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    
}