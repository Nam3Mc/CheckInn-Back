import { IsDate, IsInt, IsNotEmpty, IsString } from "class-validator";

export class ReservationDto {
    
    @IsNotEmpty()
    @IsDate()
    checkIn: Date

    @IsNotEmpty()
    @IsDate()
    checkOut: Date

    @IsNotEmpty()
    @IsString()
    roomId: string

    @IsNotEmpty()
    @IsString()
    accountId: string

    @IsNotEmpty()
    @IsInt()
    guests: number

}