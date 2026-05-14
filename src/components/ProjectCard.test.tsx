import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/lib/utils';

const baseProject: Project = {
  id: '1',
  title: 'Test Project',
  description: 'A short description for testing purposes.',
  status: 'In Progress',
  owner: 'user1',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

describe('ProjectCard', () => {
  it('displays project title', () => {
    render(<ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays truncated description when description exceeds 100 characters', () => {
    const longDescription = 'A'.repeat(150);
    const project: Project = { ...baseProject, description: longDescription };

    render(<ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />);

    // Should show truncated text (100 chars + ellipsis)
    const expectedTruncated = 'A'.repeat(100) + '…';
    expect(screen.getByText(expectedTruncated)).toBeInTheDocument();
  });

  it('displays full description when description is 100 characters or less', () => {
    const shortDescription = 'Short description';
    const project: Project = { ...baseProject, description: shortDescription };

    render(<ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Short description')).toBeInTheDocument();
  });

  it('displays "No description" when description is empty', () => {
    const project: Project = { ...baseProject, description: undefined };

    render(<ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('No description')).toBeInTheDocument();
  });

  it('displays project status', () => {
    render(<ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button is clicked', () => {
    const onEdit = vi.fn();

    render(<ProjectCard project={baseProject} onEdit={onEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(baseProject);
  });

  it('calls onDelete when Delete button is clicked', () => {
    const onDelete = vi.fn();

    render(<ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith(baseProject);
  });
});
