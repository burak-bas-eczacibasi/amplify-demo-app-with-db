import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { client } from '@/amplify-client';
import type { Project } from '@/lib/utils';

interface DeleteConfirmDialogProps {
  project: Project | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  project,
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!project) return;

    setDeleting(true);
    setError(null);

    try {
      const { errors } = await client.models.Project.delete({ id: project.id });

      if (errors) {
        setError('Failed to delete project. Please try again.');
        return;
      }

      onConfirm();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  function handleCancel() {
    setError(null);
    onCancel();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete '{project?.title}'? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={deleting} className="min-h-[44px] min-w-[44px]">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleting} className="min-h-[44px] min-w-[44px]">
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
