import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationDto } from "src/modules/dto/reserv.dto";
import { Reservation } from "src/modules/entities/reservations.entity";
import { Repository } from "typeorm";
import { RoomsRepository } from "./rooms.repo";
import { AccountsRepository } from "./account.repo";

@Injectable()
export class ReservationsRepository{

    constructor(
        @InjectRepository(Reservation)
        private readonly reservationsRepository: Repository<Reservation>,
        private readonly roomsRepository: RoomsRepository, 
        private readonly accountRepository: AccountsRepository
    ) {}

    async getReservations(): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationsRepository.find()
        return reservations 
    }

    async getUserReservations(id: string): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationsRepository.find({
            where: {id}
        })
        return reservations
    }

    async createReservation(reservationDetails: ReservationDto) {
        const {checkIn, checkOut, roomId, accountId, guests} = reservationDetails
        const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        const room = await this.roomsRepository.getRoomById(roomId)
        const account = await this.accountRepository.getAccountById(accountId)
        const total = nights * room.price

        const reservation = new Reservation
        reservation.checkin = checkIn
        reservation.checkout = checkOut
        reservation.room = room
        reservation.account = account
        reservation.price = total
        reservation.guests = guests
        
        const createdReservation = await this.reservationsRepository.save(reservation)
        return createdReservation 
    }
}