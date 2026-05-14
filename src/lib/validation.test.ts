import { describe, it, expect } from 'vitest';
import { validateProjectForm } from './validation';

describe('validateProjectForm', () => {
  describe('title validation', () => {
    it('rejects empty title with "Title is required"', () => {
      const result = validateProjectForm({ title: '', status: 'Not Started' });
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    it('rejects whitespace-only title with "Title is required"', () => {
      const result = validateProjectForm({ title: '   ', status: 'Not Started' });
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe('Title is required');
    });

    it('accepts title exactly 100 characters', () => {
      const title = 'a'.repeat(100);
      const result = validateProjectForm({ title, status: 'Not Started' });
      expect(result.valid).toBe(true);
      expect(result.errors.title).toBeUndefined();
    });

    it('rejects title of 101 characters with "Title must be 100 characters or less"', () => {
      const title = 'a'.repeat(101);
      const result = validateProjectForm({ title, status: 'Not Started' });
      expect(result.valid).toBe(false);
      expect(result.errors.title).toBe('Title must be 100 characters or less');
    });
  });

  describe('description validation', () => {
    it('accepts valid title with no description', () => {
      const result = validateProjectForm({ title: 'My Project', status: 'Not Started' });
      expect(result.valid).toBe(true);
      expect(result.errors.description).toBeUndefined();
    });

    it('accepts description exactly 500 characters', () => {
      const description = 'b'.repeat(500);
      const result = validateProjectForm({ title: 'My Project', description, status: 'In Progress' });
      expect(result.valid).toBe(true);
      expect(result.errors.description).toBeUndefined();
    });

    it('rejects description of 501 characters with "Description must be 500 characters or less"', () => {
      const description = 'b'.repeat(501);
      const result = validateProjectForm({ title: 'My Project', description, status: 'Completed' });
      expect(result.valid).toBe(false);
      expect(result.errors.description).toBe('Description must be 500 characters or less');
    });

    it('accepts undefined description', () => {
      const result = validateProjectForm({ title: 'My Project', description: undefined, status: 'Not Started' });
      expect(result.valid).toBe(true);
      expect(result.errors.description).toBeUndefined();
    });
  });
});
