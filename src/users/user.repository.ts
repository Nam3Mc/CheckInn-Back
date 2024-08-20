import { BadRequestException, Injectable } from '@nestjs/common';

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
  country?: string;
  city?: string;
};

@Injectable()
export class UsersRepository {
 
  private users: User[] = [
    {
      id: 1,
      email: 'juan.perez@example.com',
      name: 'Juan Perez',
      password: 'securepassword1',
      address: 'Calle Falsa 123',
      phone: '+34123456789',
      country: 'España',
      city: 'Madrid',
    },
    {
      id: 2,
      email: 'maria.gomez@example.com',
      name: 'Maria Gomez',
      password: 'securepassword2',
      address: 'Avenida Siempre Viva 742',
      phone: '+34987654321',
      country: 'España',
      city: 'Barcelona',
    },
    {
      id: 3,
      email: 'luis.lopez@example.com',
      name: 'Luis Lopez',
      password: 'securepassword3',
      address: 'Calle Mayor 456',
      phone: '+34678901234',
      country: 'España',
      city: 'Valencia',
    },
    {
      id: 4,
      email: 'ana.martinez@example.com',
      name: 'Ana Martinez',
      password: 'securepassword4',
      address: 'Plaza del Sol 789',
      phone: '+34789012345',
      country: 'España',
      city: 'Sevilla',
    },
    {
      id: 5,
      email: 'carlos.garcia@example.com',
      name: 'Carlos Garcia',
      password: 'securepassword5',
      address: 'Ronda de Atocha 101',
      phone: '+34890123456',
    },
    {
      id: 6,
      email: 'laura.fernandez@example.com',
      name: 'Laura Fernandez',
      password: 'securepassword6',
      address: 'Calle del Prado 202',
      phone: '+34901234567',
    },
    {
      id: 7,
      email: 'diego.sanchez@example.com',
      name: 'Diego Sanchez',
      password: 'securepassword7',
      address: 'Avenida de la Reina 303',
      phone: '+34123456789',
      country: 'España',
      city: 'Granada',
    },
    {
      id: 8,
      email: 'carolina.morales@example.com',
      name: 'Carolina Morales',
      password: 'securepassword8',
      address: 'Paseo de la Castellana 404',
      phone: '+34987654321',
    },
    {
      id: 9,
      email: 'jose.ramirez@example.com',
      name: 'Jose Ramirez',
      password: 'securepassword9',
      address: 'Calle de la Paz 505',
      phone: '+34678901234',
    },
    {
      id: 10,
      email: 'eva.dominguez@example.com',
      name: 'Eva Dominguez',
      password: 'securepassword10',
      address: 'Plaza de España 606',
      phone: '+34789012345',
      country: 'España',
      city: 'Bilbao',
    },
  ];

  getUsers(page: number, limit: number): User[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.users.slice(start, end);
  }
  
  async getById(id: number) {
    return this.users.find(user => user.id === id);
  }

  addUser(user: User) {
    const id = this.users.length + 1;
    user.id = id;
    this.users.push(user);
    return user;
  }

  updateUser(id: number, user: User) {
    const oldUser = this.users.find(user => user.id === id);
    if (!oldUser) {
      throw new BadRequestException('User not found');
    }
    const updatedUser = { ...oldUser, ...user };
    const index = this.users.findIndex(user => user.id === id);
    this.users[index] = updatedUser;
    return updatedUser;
  }

  deleteUser(id: number) {
   const index = this.users.findIndex(user => user.id === id);
   if(index === -1){
    throw new BadRequestException("User not found")
   } 
   const user = this.users[index];
   this.users.splice(index,1)
   return {message: "User Deleted ", user}
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }
}