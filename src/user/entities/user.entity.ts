import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column()
    @Exclude()
    password: string;


    @Column({ default: false })
    isAdmin: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    @ManyToMany(() => Task, (task) => task.users)
    tasks: Task[];
}
