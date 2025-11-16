import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JwtService } from '@nestjs/jwt';

describe('TodoController', () => {
  let controller: TodoController;

  const mockTodoService = {
    createTodo: jest.fn(),
    getTodos: jest.fn(),
    getTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
