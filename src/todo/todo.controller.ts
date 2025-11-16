import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Todos')
@ApiBearerAuth('JWT-auth')
@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {
    constructor(private todoService: TodoService) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new todo' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Buy groceries' },
                description: { type: 'string', example: 'Milk, eggs, bread' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Todo created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Request() req: any, @Body() createDto: { title: string; description: string }) {
        return this.todoService.createTodo(createDto, req.user.sub);
    }

    @Get()
    @ApiOperation({ summary: 'Get all todos for current user' })
    @ApiResponse({ status: 200, description: 'Returns list of todos' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    getTodos(@Request() req: any) {
        return this.todoService.getTodos(req.user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific todo by ID' })
    @ApiParam({ name: 'id', type: 'number', description: 'Todo ID' })
    @ApiResponse({ status: 200, description: 'Returns the todo' })
    @ApiResponse({ status: 404, description: 'Todo not found' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    getTodo(@Request() req: any, @Param('id') id: string) {
        return this.todoService.getTodo(Number(id), req.user.sub);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a todo' })
    @ApiParam({ name: 'id', type: 'number', description: 'Todo ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Updated title' },
                description: { type: 'string', example: 'Updated description' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Todo updated successfully' })
    @ApiResponse({ status: 404, description: 'Todo not found' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    update(@Request() req: any, @Param('id') id: string, @Body() updateDto: { title?: string; description?: string }) {
        return this.todoService.updateTodo(Number(id), updateDto, req.user.sub);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a todo' })
    @ApiParam({ name: 'id', type: 'number', description: 'Todo ID' })
    @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
    @ApiResponse({ status: 404, description: 'Todo not found' })
    @ApiResponse({ status: 403, description: 'Access denied' })
    delete(@Request() req: any, @Param('id') id: string) {
        return this.todoService.deleteTodo(Number(id), req.user.sub);
    }
}
