import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersRepository } from "./user.repo";
import { AccountsRepository } from "./account.repo";
import { RoomsRepository } from "./rooms.repo";
import { ReservationsRepository } from "./reservations.repo";
import { Rolls } from "src/decorators/rolls.decorator";
import { Roll } from "src/modules/entities/users.entity";
import { RollsGuard } from "src/guards/rolls.guard";

@Controller("test")
export class TestControler {
    constructor(
        private readonly userRepo: UsersRepository,
        private readonly accountRepo: AccountsRepository,
        private readonly roomsRepo: RoomsRepository,
        private readonly reservationRepo: ReservationsRepository 
    ){}

    @Get("users")
    @Rolls(Roll.ADMIN)
    @UseGuards(RollsGuard)
    getUsers() {
        return this.userRepo.getUsers()
    }

    
}