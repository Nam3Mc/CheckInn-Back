import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from 'src/modules/entities/reservations.entity';
import { Repository } from 'typeorm';
import { RoomsRepository } from './rooms.repo';
import { AccountsRepository } from './account.repo';
import { ReservationDto } from './reservation.dto';

@Injectable()
export class ReservationsRepository {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    private readonly roomsRepository: RoomsRepository,
    private readonly accountRepository: AccountsRepository,
  ) {}

  async getReservations(): Promise<Reservation[]> {
    const reservations: Reservation[] =
      await this.reservationsRepository.find();
    return reservations;
  }

  async getUserReservations(id: string): Promise<Reservation[]> {
    const reservations: Reservation[] = await this.reservationsRepository.find({
      where: { id },
    });
    return reservations;
  }

  async createReservation(reservationDetails: ReservationDto) {
    const { checkIn, checkOut, roomId, accountId, guests } = reservationDetails;
    const nights =
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
    const room = await this.roomsRepository.getRoomById(roomId);
    const account = await this.accountRepository.getAccountById(accountId);
    const total = nights * room.price;
    const isReserved = await this.roomsRepository.roomCalendar(
      roomId,
      checkIn,
      checkOut,
    );

    if (isReserved) {
      throw new BadRequestException('This dates are not available');
    } else {
      const reservation = new Reservation();
      reservation.checkin = checkIn;
      reservation.checkout = checkOut;
      reservation.room = room;
      reservation.account = account;
      reservation.price = total;
      reservation.guests = guests;

      const createdReservation =
        await this.reservationsRepository.save(reservation);
      return createdReservation;
    }

    async getUserReservations(id: string): Promise<Reservation[]> {
        const reservations: Reservation[] = await this.reservationsRepository.find({
            where: {id}
        })
        return reservations
    }

    async createReservation(reservationDetails: ReservationDto) {
        const {checkIn, checkOut, roomId, accountId, guests} = reservationDetails
        const inn = new Date(checkIn)
        const out = new Date(checkOut)

        const nights = (out.getTime() - inn.getTime()) / (1000 * 60 * 60 * 24)
        const room = await this.roomsRepository.getRoomById(roomId)
        const account = await this.accountRepository.getAccountById(accountId)
        const total = nights * room.price

        // const isReserved = await this.roomsRepository.isAvailable(roomId, checkIn, checkOut)

        // if ( isReserved ) {
            // throw new BadRequestException("This dates are not available")
        // } else {

            const reservation = new Reservation
            reservation.checkin = checkIn
            reservation.checkout = checkOut
            reservation.room = room
            reservation.account = account
            reservation.price = total
            reservation.guests = guests
            
            const createdReservation = await this.reservationsRepository.save(reservation)
            return createdReservation 
        // }
    }

}
