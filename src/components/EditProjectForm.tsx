import { useEffect, useState } from 'react';
import { client } from '@/amplify-client';
import { validateProjectForm } from '@/lib/validation';
import type { Project, ProjectStatus } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditProjectFormProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function EditProjectForm({ project, open, onClose, onSubmit }: EditProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Not Started');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync form state when project prop changes or modal opens
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description || '');
      setStatus(project.status);
      setFormErrors({});
      setApiError(null);
    }
  }, [project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form
    const validation = validateProjectForm({ title, description, status });
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setApiError(null);

    if (!project) return;

    try {
      setSubmitting(true);
      const { errors } = await client.models.Project.update({
        id: project.id,
        title: title.trim(),
        description: description?.trim() || undefined,
        status,
      });

      if (errors) {
        setApiError('Failed to update project. Please try again.');
        return;
      }

      onSubmit();
    } catch {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              aria-invalid={!!formErrors.title}
              aria-describedby={formErrors.title ? 'edit-title-error' : undefined}
            />
            {formErrors.title && (
              <p id="edit-title-error" className="text-sm text-destructive">
                {formErrors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description (optional)"
              aria-invalid={!!formErrors.description}
              aria-describedby={formErrors.description ? 'edit-description-error' : undefined}
            />
            {formErrors.description && (
              <p id="edit-description-error" className="text-sm text-destructive">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {apiError && (
            <p className="text-sm text-destructive" role="alert">
              {apiError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="min-h-[44px] min-w-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] min-w-[44px]"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
