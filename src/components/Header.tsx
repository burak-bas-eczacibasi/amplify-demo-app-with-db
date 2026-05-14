import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSignOut: () => void;
  user?: { username?: string; signInDetails?: { loginId?: string } };
}

export function Header({ onSignOut, user }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-xl font-bold">Project Tracker</h1>
        <div className="flex items-center gap-4">
          {user?.signInDetails?.loginId && (
            <span className="text-sm text-muted-foreground">
              {user.signInDetails.loginId}
            </span>
          )}
          <Button variant="outline" onClick={onSignOut} className="min-h-[44px] min-w-[44px]">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
