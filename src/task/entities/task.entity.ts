import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: 0 })
    position: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => Board, (board) => board.tasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    board: Board;

    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    users: User[];
}