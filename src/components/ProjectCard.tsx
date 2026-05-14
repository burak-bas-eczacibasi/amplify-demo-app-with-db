import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { truncateDescription, type Project } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status] || ''}`}>
            {project.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {project.description ? (
          <p className="text-sm text-muted-foreground">
            {truncateDescription(project.description)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(project)} className="min-h-[44px] min-w-[44px]">
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(project)} className="min-h-[44px] min-w-[44px]">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
