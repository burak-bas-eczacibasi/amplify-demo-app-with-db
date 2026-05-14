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

export function validateProjectForm(data: ProjectFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be 100 characters or less';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be 500 characters or less';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
