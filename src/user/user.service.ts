// src/user/user.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findOneByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    async create(createUserDto: CreateUserDto): Promise<User[]> {
        try {
            const newUser = this.userRepository.create(createUserDto);
            await this.userRepository.save(newUser)
            return this.findAll()
        }
        catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new ConflictException('Username already exists');
            }
            throw error;
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User[]> {
        await this.userRepository.update(id, updateUserDto);
        this.userRepository.findOne({ where: { id } });
        return this.findAll()
    }

    async remove(id: number): Promise<User[]> {
        await this.userRepository.delete(id);
        return this.findAll()
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (user && await user.comparePassword(password)) {
            return user;
        }
        return null;
    }
}
