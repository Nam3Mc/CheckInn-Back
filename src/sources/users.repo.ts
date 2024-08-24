import { Injectable } from "@nestjs/common";
import { User } from "../modules/entities/users.entity";
import { CreateUserDto } from "src/modules/dto/users.dto";
import { Account } from "src/modules/entities/accounts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AccountsRepository } from "./account.repo";

@Injectable()
export class UsersRepository {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly accountsRepository: AccountsRepository
    ) {}

    async getUsers(): Promise<User[]> {
        const usersList = await this.userRepository.find()
        return usersList
    }

    async getUserById(id: string): Promise<User> {
        const user: User = await this.userRepository.findOneBy({id})
        return user
    }

    async addUser(userDto: CreateUserDto): Promise<Partial<User>> {
        const user = new User
        const account = new Account
        user.accounts = [account]
        user.name = userDto.name
        user.email = userDto.email
        user.phone = userDto.phone
        user.password = userDto.password

        const createdAccount = await this.accountsRepository.createAccount(account)
        const createdUser = await this.userRepository.save(user)
        
        return createdUser
    }
}