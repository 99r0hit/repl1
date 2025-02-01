import { Button } from "@/components/ui/button";
import SessionForm from "@/components/session-form";
import SessionCard from "@/components/session-card";
import TimeSlotForm from "@/components/time-slot-form";
import TimeSlotCard from "@/components/time-slot-card";
import { useSessions } from "@/hooks/use-sessions";
import { useTimeSlots } from "@/hooks/use-time-slots";
import { useUser } from "@/hooks/use-user";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { sessions, isLoading: isLoadingSessions, createSession, updateSession, deleteSession } =
    useSessions();
  const {
    coachTimeSlots,
    isLoading: isLoadingTimeSlots,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
  } = useTimeSlots();
  const { logout } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (isLoadingSessions || isLoadingTimeSlots) {
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
          <h1 className="text-3xl font-bold">Chess Class Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="sessions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="time-slots">Time Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Session</Button>
                </DialogTrigger>
                <DialogContent>
                  <SessionForm onSubmit={createSession} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onUpdate={updateSession}
                  onDelete={deleteSession}
                  showActions
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time-slots" className="space-y-4">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Time Slot</Button>
                </DialogTrigger>
                <DialogContent>
                  <TimeSlotForm onSubmit={createTimeSlot} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {coachTimeSlots.map((timeSlot) => (
                <TimeSlotCard
                  key={timeSlot.id}
                  timeSlot={timeSlot}
                  onUpdate={updateTimeSlot}
                  onDelete={deleteTimeSlot}
                  showActions
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}