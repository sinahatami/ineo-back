import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../user/entities/user.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Board } from 'src/board/entities/board.entity';
import { UserService } from 'src/user/user.service';
import { BoardService } from 'src/board/board.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Board])],
  controllers: [TaskController],
  providers: [TaskService, UserService, BoardService],
})
export class TaskModule { }
