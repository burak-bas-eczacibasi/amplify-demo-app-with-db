import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { validateProjectForm } from '@/lib/validation';
import { client } from '@/amplify-client';
import type { ProjectStatus } from '@/lib/utils';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function CreateProjectModal({ open, onClose, onSubmit }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Not Started');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setStatus('Not Started');
      setFormErrors({});
      setApiError(null);
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit() {
    // Validate form
    const validation = validateProjectForm({ title, description, status });
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setApiError(null);

    try {
      setSubmitting(true);
      const { errors } = await client.models.Project.create({
        title: title.trim(),
        description: description?.trim() || undefined,
        status,
      });

      if (errors) {
        setApiError('Failed to create project. Please try again.');
        return;
      }

      // Success: reset form and notify parent
      setTitle('');
      setDescription('');
      setStatus('Not Started');
      setFormErrors({});
      setApiError(null);
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
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {apiError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {apiError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="project-title">Title</Label>
            <Input
              id="project-title"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              aria-invalid={!!formErrors.title}
              aria-describedby={formErrors.title ? 'title-error' : undefined}
            />
            {formErrors.title && (
              <p id="title-error" className="text-sm text-destructive">
                {formErrors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              aria-invalid={!!formErrors.description}
              aria-describedby={formErrors.description ? 'description-error' : undefined}
            />
            {formErrors.description && (
              <p id="description-error" className="text-sm text-destructive">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
              <SelectTrigger id="project-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting} className="min-h-[44px] min-w-[44px]">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="min-h-[44px] min-w-[44px]">
            {submitting ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
