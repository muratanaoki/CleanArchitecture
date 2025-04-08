import { Todo } from '../../../../src/domain/entities/Todo';
import { TodoId } from '../../../../src/domain/valueObjects/TodoId';
import { UserId } from '../../../../src/domain/valueObjects/UserId';
import { Priority, PriorityValue } from '../../../../src/domain/valueObjects/Priority';
import { Status, StatusValue } from '../../../../src/domain/valueObjects/Status';

describe('Todo Entity', () => {
  const userId = UserId.create();
  const validProps = {
    userId,
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: new Date('2025-12-31'),
    priority: Priority.fromValue(PriorityValue.MEDIUM),
    status: Status.fromValue(StatusValue.TODO)
  };

  describe('create', () => {
    it('should create a valid Todo entity', () => {
      const todo = Todo.create(validProps);
      
      expect(todo.getId()).toBeDefined();
      expect(todo.getUserId().equals(userId)).toBeTruthy();
      expect(todo.getTitle()).toBe('Test Todo');
      expect(todo.getDescription()).toBe('Test Description');
      expect(todo.getPriority().getValue()).toBe(PriorityValue.MEDIUM);
      expect(todo.getStatus().getValue()).toBe(StatusValue.TODO);
      expect(todo.getCreatedAt()).toBeInstanceOf(Date);
      expect(todo.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should throw an error if title is empty', () => {
      const invalidProps = {
        ...validProps,
        title: ''
      };
      
      expect(() => Todo.create(invalidProps)).toThrow('Todo title cannot be empty');
    });

    it('should throw an error if title is too long', () => {
      const invalidProps = {
        ...validProps,
        title: 'a'.repeat(101)
      };
      
      expect(() => Todo.create(invalidProps)).toThrow('Todo title cannot be longer than 100 characters');
    });
  });

  describe('business methods', () => {
    let todo: Todo;
    
    beforeEach(() => {
      todo = Todo.create(validProps);
    });

    it('should update title', () => {
      const newTitle = 'Updated Title';
      todo.updateTitle(newTitle);
      expect(todo.getTitle()).toBe(newTitle);
    });

    it('should update description', () => {
      const newDescription = 'Updated Description';
      todo.updateDescription(newDescription);
      expect(todo.getDescription()).toBe(newDescription);
    });

    it('should update due date', () => {
      const newDueDate = new Date('2026-01-15');
      todo.updateDueDate(newDueDate);
      expect(todo.getDueDate()).toEqual(newDueDate);
    });

    it('should update priority', () => {
      const newPriority = Priority.fromValue(PriorityValue.HIGH);
      todo.updatePriority(newPriority);
      expect(todo.getPriority().getValue()).toBe(PriorityValue.HIGH);
    });

    it('should mark as in progress', () => {
      todo.markAsInProgress();
      expect(todo.getStatus().getValue()).toBe(StatusValue.IN_PROGRESS);
    });

    it('should mark as done', () => {
      todo.markAsDone();
      expect(todo.getStatus().getValue()).toBe(StatusValue.DONE);
    });

    it('should mark as todo', () => {
      todo.markAsDone();
      todo.markAsTodo();
      expect(todo.getStatus().getValue()).toBe(StatusValue.TODO);
    });

    it('should throw error when marking a completed todo as in progress', () => {
      todo.markAsDone();
      expect(() => todo.markAsInProgress()).toThrow('Cannot mark a completed todo as in progress');
    });

    it('should detect overdue todos', () => {
      const pastDueDate = new Date();
      pastDueDate.setDate(pastDueDate.getDate() - 1);
      
      const overdueTodo = Todo.create({
        ...validProps,
        dueDate: pastDueDate
      });
      
      expect(overdueTodo.isOverdue()).toBeTruthy();
      
      overdueTodo.markAsDone();
      expect(overdueTodo.isOverdue()).toBeFalsy();
    });
  });
});
