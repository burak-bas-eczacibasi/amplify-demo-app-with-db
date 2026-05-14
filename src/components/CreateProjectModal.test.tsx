import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProjectModal } from './CreateProjectModal';

// Mock the amplify client
const mockCreate = vi.fn();
vi.mock('@/amplify-client', () => ({
  client: {
    models: {
      Project: {
        create: (...args: unknown[]) => mockCreate(...args),
        list: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
}));

// Mock Radix Dialog portal to render inline for testing
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog');
  return { ...actual };
});

describe('CreateProjectModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields when open', () => {
    render(<CreateProjectModal {...defaultProps} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });

  it('shows validation error for empty title on submit', async () => {
    render(<CreateProjectModal {...defaultProps} />);

    // Click submit without entering a title
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();

    render(<CreateProjectModal {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onSubmit on successful creation', async () => {
    const onSubmit = vi.fn();
    mockCreate.mockResolvedValue({ data: { id: '1', title: 'New Project' }, errors: null });

    render(<CreateProjectModal {...defaultProps} onSubmit={onSubmit} />);

    // Fill in the title
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Project' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(mockCreate).toHaveBeenCalledWith({
      title: 'New Project',
      description: undefined,
      status: 'Not Started',
    });
  });
});
