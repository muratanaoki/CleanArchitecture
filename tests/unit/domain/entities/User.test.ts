import { User } from '../../../../src/domain/entities/User';
import { UserId } from '../../../../src/domain/valueObjects/UserId';
import { Email } from '../../../../src/domain/valueObjects/Email';
import { Password } from '../../../../src/domain/valueObjects/Password';
import { Role, RoleValue } from '../../../../src/domain/valueObjects/Role';

describe('User Entity', () => {
  const validProps = {
    name: 'Test User',
    email: Email.create('test@example.com'),
    password: Password.create('Password123')
  };

  describe('create', () => {
    it('should create a valid User entity', () => {
      const user = User.create(validProps);
      
      expect(user.getId()).toBeDefined();
      expect(user.getName()).toBe('Test User');
      expect(user.getEmail().getValue()).toBe('test@example.com');
      expect(user.getRole().getValue()).toBe(RoleValue.USER); // Default role
      expect(user.getCreatedAt()).toBeInstanceOf(Date);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should throw an error if name is empty', () => {
      const invalidProps = {
        ...validProps,
        name: ''
      };
      
      expect(() => User.create(invalidProps)).toThrow('User name cannot be empty');
    });

    it('should throw an error if name is too long', () => {
      const invalidProps = {
        ...validProps,
        name: 'a'.repeat(51)
      };
      
      expect(() => User.create(invalidProps)).toThrow('User name cannot be longer than 50 characters');
    });
  });

  describe('business methods', () => {
    let user: User;
    
    beforeEach(() => {
      user = User.create(validProps);
    });

    it('should update name', () => {
      const newName = 'Updated Name';
      user.updateName(newName);
      expect(user.getName()).toBe(newName);
    });

    it('should update email', () => {
      const newEmail = Email.create('updated@example.com');
      user.updateEmail(newEmail);
      expect(user.getEmail().getValue()).toBe('updated@example.com');
    });

    it('should update password', async () => {
      const newPassword = Password.create('NewPassword123');
      await user.updatePassword(newPassword);
      
      const isValid = await user.validatePassword('NewPassword123');
      expect(isValid).toBeTruthy();
    });

    it('should promote to admin', () => {
      user.promoteToAdmin();
      expect(user.getRole().getValue()).toBe(RoleValue.ADMIN);
      expect(user.isAdmin()).toBeTruthy();
    });

    it('should demote to user', () => {
      user.promoteToAdmin();
      user.demoteToUser();
      expect(user.getRole().getValue()).toBe(RoleValue.USER);
      expect(user.isAdmin()).toBeFalsy();
    });

    it('should throw error when promoting an admin', () => {
      user.promoteToAdmin();
      expect(() => user.promoteToAdmin()).toThrow('User is already an admin');
    });

    it('should throw error when demoting a regular user', () => {
      expect(() => user.demoteToUser()).toThrow('User is already a regular user');
    });

    it('should validate password correctly', async () => {
      const isValid = await user.validatePassword('Password123');
      const isInvalid = await user.validatePassword('WrongPassword');
      
      expect(isValid).toBeTruthy();
      expect(isInvalid).toBeFalsy();
    });
  });
});
