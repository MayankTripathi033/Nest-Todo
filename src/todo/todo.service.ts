import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService) {}

    async createTodo(data: { title: string; description: string }, userId: string): Promise<Todo> {
        return this.prisma.todo.create({
            data: {
                title: data.title,
                description: data.description,
                userId: userId,
            },
        });
    }

    async getTodos(userId: string): Promise<Todo[]> {
        return this.prisma.todo.findMany({ where: { userId } });
    }

    async getTodo(id: number, userId: string): Promise<Todo | null> {
        const todo = await this.prisma.todo.findUnique({ where: { id } });
        if (!todo) throw new NotFoundException('Todo not found');
        if (todo.userId !== userId) throw new ForbiddenException('Access denied');
        return todo;
    }

    async updateTodo(id: number, data: { title?: string; description?: string }, userId: string): Promise<Todo> {
        const todo = await this.prisma.todo.findUnique({ where: { id } });
        if (!todo) throw new NotFoundException('Todo not found');
        if (todo.userId !== userId) throw new ForbiddenException('Access denied');
        
        return this.prisma.todo.update({ where: { id }, data });
    }

    async deleteTodo(id: number, userId: string): Promise<Todo> {
        const todo = await this.prisma.todo.findUnique({ where: { id } });
        if (!todo) throw new NotFoundException('Todo not found');
        if (todo.userId !== userId) throw new ForbiddenException('Access denied');
        
        return this.prisma.todo.delete({ where: { id } });
    }
}
