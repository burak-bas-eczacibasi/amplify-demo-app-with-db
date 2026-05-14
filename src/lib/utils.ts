import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Project types
export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface ProjectFormData {
  title: string;
  description?: string;
  status: ProjectStatus;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// Truncate description to maxLength chars with ellipsis
export function truncateDescription(description: string, maxLength: number = 100): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + '…';
}

// Sort projects by createdAt descending (most recent first)
export function sortProjectsByDate(projects: Project[]): Project[] {
  return [...projects].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
