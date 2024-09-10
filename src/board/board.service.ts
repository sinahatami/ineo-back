import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board) private readonly boardRepository: Repository<Board>,
    ) { }

    async create(createBoardDto: CreateBoardDto): Promise<Board[]> {
        const board = this.boardRepository.create(createBoardDto);

        if (!board.position) {
            let boards: Board[] = await this.findAll()
            board.position = boards.length - 1
        }

        await this.boardRepository.save(board);
        return this.findAll()
    }

    async findAll(): Promise<Board[]> {
        return this.boardRepository.find({
            relations: ['tasks', 'tasks.users'],
            order: {
                position: 'ASC',
                tasks: {
                    position: 'ASC',
                }
            }
        });
    }

    findOne(id: number): Promise<Board> {
        return this.boardRepository.findOne({ where: { id }, relations: ['tasks'] });
    }

    async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
        const board = await this.boardRepository.findOneBy({ id });
        if (!board) {
            throw new Error(`Board with id ${id} not found`);
        }
        Object.assign(board, updateBoardDto);

        return this.boardRepository.save(board);
    }

    async remove(id: number): Promise<Board[]> {
        await this.boardRepository.delete(id);
        return this.findAll();
    }
}