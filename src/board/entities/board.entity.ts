import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 0 })
    position: number;

    @OneToMany(() => Task, (task) => task.board, { cascade: true, onDelete: 'CASCADE' })
    tasks: Task[];
}