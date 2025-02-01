import { Button } from "@/components/ui/button";
import SessionCard from "@/components/session-card";
import { useSessions } from "@/hooks/use-sessions";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

export default function PublicSessions() {
  const { sessions, isLoading } = useSessions();
  const { user } = useUser();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Chess Class Sessions</h1>
          {user ? (
            <Button onClick={() => setLocation("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <Button onClick={() => setLocation("/login")}>Coach Login</Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
}
