import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { sortProjectsByDate, truncateDescription, type Project } from './utils';

/**
 * Property-based tests for utility functions.
 * Feature: amplify-project-tracker
 */

describe('Property 3: Project sort ordering', () => {
  /**
   * **Validates: Requirements 6.1**
   *
   * For any list of projects with distinct createdAt timestamps,
   * sorting them for dashboard display SHALL produce a list where
   * each project's createdAt is greater than or equal to the next
   * project's createdAt (most recent first).
   */
  it('sort produces descending createdAt order for any list of projects with distinct timestamps', () => {
    // Generator for a list of projects with distinct createdAt ISO date strings
    const distinctProjectsArb = fc
      .set(
        fc.date({
          min: new Date('2000-01-01T00:00:00.000Z'),
          max: new Date('2099-12-31T23:59:59.999Z'),
        }),
        { minLength: 0, maxLength: 20, compare: (a, b) => a.getTime() === b.getTime() }
      )
      .map((dates) =>
        dates.map(
          (date, index): Project => ({
            id: `project-${index}`,
            title: `Project ${index}`,
            description: `Description ${index}`,
            status: 'Not Started',
            owner: 'user-1',
            createdAt: date.toISOString(),
            updatedAt: date.toISOString(),
          })
        )
      );

    fc.assert(
      fc.property(distinctProjectsArb, (projects) => {
        const sorted = sortProjectsByDate(projects);

        // Verify descending order: each element's createdAt >= next element's createdAt
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = new Date(sorted[i].createdAt).getTime();
          const next = new Date(sorted[i + 1].createdAt).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }

        // Verify the sorted array has the same length as input
        expect(sorted.length).toBe(projects.length);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Property 4: Description truncation preserves short strings and truncates long ones', () => {
  /**
   * **Validates: Requirements 6.2**
   *
   * For any string, if its length is less than or equal to 100 characters,
   * the truncation function SHALL return it unchanged. If its length exceeds
   * 100 characters, the truncation function SHALL return a string of exactly
   * 101 characters consisting of the first 100 characters of the original
   * followed by an ellipsis character ('…').
   */
  it('strings ≤100 chars are returned unchanged', () => {
    const shortStringArb = fc.string({ minLength: 0, maxLength: 100 });

    fc.assert(
      fc.property(shortStringArb, (input) => {
        const result = truncateDescription(input);
        expect(result).toBe(input);
      }),
      { numRuns: 100 }
    );
  });

  it('strings >100 chars are truncated to first 100 chars + ellipsis (101 chars total)', () => {
    const longStringArb = fc.string({ minLength: 101, maxLength: 500 });

    fc.assert(
      fc.property(longStringArb, (input) => {
        const result = truncateDescription(input);

        // Result should be exactly 101 characters
        expect(result.length).toBe(101);

        // Result should start with the first 100 characters of the input
        expect(result.slice(0, 100)).toBe(input.slice(0, 100));

        // Result should end with the ellipsis character
        expect(result[100]).toBe('…');
      }),
      { numRuns: 100 }
    );
  });
});
