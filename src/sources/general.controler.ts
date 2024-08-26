import { Controller, Get } from "@nestjs/common";
import { UsersRepository } from "./user.repo";
import { AccountsRepository } from "./account.repo";
import { RoomsRepository } from "./rooms.repo";
import { ReservationsRepository } from "./reservations.repo";

@Controller("test")
export class TestControler {
    constructor(
        private readonly userRepo: UsersRepository,
        private readonly accountRepo: AccountsRepository,
        private readonly roomsRepo: RoomsRepository,
        private readonly reservationRepo: ReservationsRepository 
    ){}

    @Get()
    getUsers() {
        return this.userRepo.getUsers()
    }

    
}