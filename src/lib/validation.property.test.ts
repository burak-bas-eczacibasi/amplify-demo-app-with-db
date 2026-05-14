import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateProjectForm } from './validation';

/**
 * Property-based tests for project form validation.
 * Feature: amplify-project-tracker
 */

describe('Feature: amplify-project-tracker - Validation Property Tests', () => {
  describe('Property 1: Title validation correctness', () => {
    /**
     * **Validates: Requirements 5.2, 5.5, 5.7**
     *
     * For any string input, validation accepts the title if and only if
     * the trimmed string has a length between 1 and 100 characters (inclusive).
     */
    it('should accept title iff trimmed length is between 1 and 100 (inclusive)', () => {
      fc.assert(
        fc.property(fc.string(), (title) => {
          const result = validateProjectForm({
            title,
            description: undefined,
            status: 'Not Started',
          });

          const trimmedLength = title.trim().length;
          const shouldAccept = trimmedLength >= 1 && trimmedLength <= 100;

          if (shouldAccept) {
            expect(result.errors.title).toBeUndefined();
          } else {
            expect(result.errors.title).toBeDefined();
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Description validation correctness', () => {
    /**
     * **Validates: Requirements 5.3**
     *
     * For any string input provided as a description, validation accepts it
     * if its length is between 0 and 500 characters (inclusive), and rejects it
     * if it exceeds 500 characters. An absent (undefined) description is always accepted.
     */
    it('should accept description iff length is 0-500 characters', () => {
      fc.assert(
        fc.property(fc.string(), (description) => {
          const result = validateProjectForm({
            title: 'Valid Title',
            description,
            status: 'Not Started',
          });

          const shouldAccept = description.length <= 500;

          if (shouldAccept) {
            expect(result.errors.description).toBeUndefined();
          } else {
            expect(result.errors.description).toBeDefined();
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should always accept undefined description', () => {
      fc.assert(
        fc.property(fc.constant(undefined), (_description) => {
          const result = validateProjectForm({
            title: 'Valid Title',
            description: undefined,
            status: 'Not Started',
          });

          expect(result.errors.description).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });
});
