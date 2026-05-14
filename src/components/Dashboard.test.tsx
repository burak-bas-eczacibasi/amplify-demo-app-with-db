import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from './Dashboard';

// Mock the amplify client
const mockList = vi.fn();
vi.mock('@/amplify-client', () => ({
  client: {
    models: {
      Project: {
        list: (...args: unknown[]) => mockList(...args),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Never resolve the promise so it stays in loading state
    mockList.mockReturnValue(new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('renders empty state when no projects returned', async () => {
    mockList.mockResolvedValue({ data: [], errors: null });

    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText('No projects yet. Create your first project to get started.')
      ).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    mockList.mockRejectedValue(new Error('Network error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load projects. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('renders error state when API returns errors', async () => {
    mockList.mockResolvedValue({ data: null, errors: [{ message: 'Auth error' }] });

    render(<Dashboard />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load projects. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('renders project cards when projects are returned', async () => {
    mockList.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Project Alpha',
          description: 'First project',
          status: 'In Progress',
          owner: 'user1',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Project Beta',
          description: 'Second project',
          status: 'Completed',
          owner: 'user1',
          createdAt: '2024-01-14T10:00:00Z',
          updatedAt: '2024-01-14T10:00:00Z',
        },
      ],
      errors: null,
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Project Alpha')).toBeInTheDocument();
      expect(screen.getByText('Project Beta')).toBeInTheDocument();
    });
  });

  it('"Create Project" button is present after loading', async () => {
    mockList.mockResolvedValue({ data: [], errors: null });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
    });
  });
});
