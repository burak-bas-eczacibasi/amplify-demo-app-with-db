import { describe, it, expect } from 'vitest';
import { truncateDescription, sortProjectsByDate, type Project } from './utils';

describe('truncateDescription', () => {
  it('returns empty string unchanged', () => {
    expect(truncateDescription('')).toBe('');
  });

  it('returns string exactly 100 chars unchanged', () => {
    const str = 'a'.repeat(100);
    expect(truncateDescription(str)).toBe(str);
  });

  it('truncates string of 101 chars to 100 chars + ellipsis', () => {
    const str = 'a'.repeat(101);
    const result = truncateDescription(str);
    expect(result).toBe('a'.repeat(100) + '…');
    expect(result.length).toBe(101);
  });

  it('returns short string unchanged', () => {
    expect(truncateDescription('Hello world')).toBe('Hello world');
  });
});

describe('sortProjectsByDate', () => {
  const makeProject = (id: string, createdAt: string): Project => ({
    id,
    title: `Project ${id}`,
    status: 'Not Started',
    owner: 'user1',
    createdAt,
    updatedAt: createdAt,
  });

  it('returns empty array for empty input', () => {
    expect(sortProjectsByDate([])).toEqual([]);
  });

  it('returns single project unchanged', () => {
    const project = makeProject('1', '2024-01-15T10:00:00Z');
    expect(sortProjectsByDate([project])).toEqual([project]);
  });

  it('sorts multiple projects by createdAt descending', () => {
    const oldest = makeProject('1', '2024-01-01T00:00:00Z');
    const middle = makeProject('2', '2024-06-15T12:00:00Z');
    const newest = makeProject('3', '2024-12-31T23:59:59Z');

    const result = sortProjectsByDate([oldest, newest, middle]);

    expect(result[0].id).toBe('3');
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('1');
  });
});
