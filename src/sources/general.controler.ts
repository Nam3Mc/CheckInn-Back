
// import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
// import { UsersRepository } from "./user.repo";
// import { AccountsRepository } from "./account.repo";
// import { RoomsRepository } from "./rooms.repo";
// import { ReservationsRepository } from "./reservations.repo";
// import { Rolls } from "src/decorators/rolls.decorator";
// import { Roll } from "src/modules/entities/users.entity";
// import { RollsGuard } from "src/guards/rolls.guard";
// import { CreateUserDto } from "src/modules/dto/users.dto";
// import { ReservationDto } from "./reservation.dto";


// @Controller('test')
// export class TestControler {
//   constructor(
//     private readonly userRepo: UsersRepository,
//     private readonly accountRepo: AccountsRepository,
//     private readonly roomsRepo: RoomsRepository,
//     private readonly reservationRepo: ReservationsRepository,
//   ) {}

//   @Get('users')
//   @Rolls(Roll.ADMIN)
//   @UseGuards(RollsGuard)
//   getUsers() {
//     return this.userRepo.getUsers();
//   }


//     @Get("rooms") 
//         getRooms() {
//         return this.roomsRepo.getRooms()
//     }

//     @Get("rooms/:id") 
//     getRoomReservations(@Param("id") id: string) {
//         console.log(id)
//         return this.roomsRepo.roomCalendar(id)
//     }

//     @Post()
//     addUser(@Body() userDto: CreateUserDto) {
//         return this.userRepo.addUser(userDto)
//     }

//     @Post("book")
//     newBook(@Body() book: ReservationDto ) {
//         return this.reservationRepo.createReservation(book)
//     }
  
//   // @Post()
//   // addUser(@Body() userDto: CreateUserDto) {
//   //   return this.userRepo.addUser(userDto);
//   // }
// }
