import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../user/entities/user.entity';
import { Board } from 'src/board/entities/board.entity';
import { Task } from './entities/task.entity';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Board) private readonly boardRepository: Repository<Board>,
        private boardService: BoardService
    ) { }

    async create(createTaskDto: CreateTaskDto): Promise<Board[]> {
        const { boardId, ...taskData } = createTaskDto;

        const board = await this.boardRepository.findOneBy({ id: createTaskDto.boardId });
        if (!board) {
            throw new Error('Board not found');
        }

        let tasks: Task[] = await this.findAll()
        const task = this.taskRepository.create({ ...taskData, board });
        if (!task.position) {
            task.position = tasks.length - 1
        }
        await this.taskRepository.save(task);
        return this.boardService.findAll()
    }

    findAll(): Promise<Task[]> {
        return this.taskRepository.find({ relations: ['board'] });
    }

    findOne(id: number): Promise<Task> {
        return this.taskRepository.findOne({ where: { id }, relations: ['board', 'users'] });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto): Promise<any> {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['board', 'users'],
        });

        if (!task) {
            throw new Error('Task not found');
        }

        if (!updateTaskDto.preBoardId) {

            Object.assign(task, updateTaskDto);

            await this.taskRepository.save(task);

            return this.boardService.findAll();
        } else {
            const { boardId, userIds, preBoardId } = updateTaskDto;

            if (boardId) {
                const board = await this.boardRepository.findOne({ where: { id: boardId } });
                if (!board) {
                    throw new Error('Board not found');
                }
                task.board = board;
            }

            if (userIds && userIds.length > 0) {
                const users = await this.userRepository.find({
                    where: { id: In(userIds) },
                });


                if (users.length === 0) {
                    throw new Error('No users found');
                }

                task.users = users;
            }

            await this.taskRepository.save(task);


            return this.boardService.findAll();
        }
    }


    async remove(id: number): Promise<Board[]> {
        await this.taskRepository.delete(id);
        return this.boardService.findAll();
    }
}
