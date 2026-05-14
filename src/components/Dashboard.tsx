import { useEffect, useState } from 'react';
import { client } from '@/amplify-client';
import { sortProjectsByDate, type Project } from '@/lib/utils';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { EditProjectForm } from './EditProjectForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  async function fetchProjects() {
    try {
      setLoading(true);
      setError(null);
      const { data, errors } = await client.models.Project.list();
      if (errors) {
        setError('Failed to load projects. Please try again.');
        return;
      }
      setProjects(sortProjectsByDate(data as unknown as Project[]));
    } catch (err) {
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function handleProjectCreated() {
    fetchProjects();
    setCreateModalOpen(false);
  }

  function handleProjectUpdated() {
    fetchProjects();
    setEditingProject(null);
  }

  function handleProjectDeleted() {
    fetchProjects();
    setDeletingProject(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={fetchProjects}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="min-h-[44px] min-w-[44px]"
        >
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">
            No projects yet. Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditingProject(project)}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleProjectCreated}
      />

      <EditProjectForm
        project={editingProject}
        open={editingProject !== null}
        onClose={() => setEditingProject(null)}
        onSubmit={handleProjectUpdated}
      />

      <DeleteConfirmDialog
        project={deletingProject}
        open={deletingProject !== null}
        onConfirm={handleProjectDeleted}
        onCancel={() => setDeletingProject(null)}
      />
    </div>
  );
}
