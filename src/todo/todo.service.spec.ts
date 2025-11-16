import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma.service';

describe('TodoService', () => {
  let service: TodoService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
