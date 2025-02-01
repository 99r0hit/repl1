import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InsertSession, SelectSession } from "@db/schema";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SessionFormProps = {
  session?: SelectSession;
  onSubmit: (
    data: Omit<InsertSession, "id" | "coachId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
};

export default function SessionForm({ session, onSubmit }: SessionFormProps) {
  const form = useForm({
    defaultValues: session
      ? {
          sessionNumber: session.sessionNumber,
          sessionDate: session.sessionDate,
          attendance: session.attendance,
          topics: session.topics,
          homework: session.homework,
          gameAnalysis: session.gameAnalysis,
        }
      : {
          sessionNumber: 1,
          sessionDate: new Date().toISOString().split("T")[0],
          attendance: "",
          topics: "",
          homework: "",
          gameAnalysis: "",
        },
  });

  const handleSubmit = async (
    data: Omit<InsertSession, "id" | "coachId" | "createdAt" | "updatedAt">
  ) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Failed to submit session:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {session ? "Edit Session" : "Create New Session"}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sessionNumber">Session Number</Label>
          <Input
            id="sessionNumber"
            type="number"
            {...form.register("sessionNumber", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionDate">Date</Label>
          <Input
            id="sessionDate"
            type="date"
            {...form.register("sessionDate", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendance">Attendance (comma-separated)</Label>
        <Input
          id="attendance"
          {...form.register("attendance", { required: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="topics">Topics Covered</Label>
        <Textarea id="topics" {...form.register("topics", { required: true })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="homework">Homework</Label>
        <Textarea
          id="homework"
          {...form.register("homework", { required: true })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gameAnalysis">Game Analysis</Label>
        <Textarea
          id="gameAnalysis"
          {...form.register("gameAnalysis", { required: true })}
        />
      </div>

      <Button type="submit" className="w-full">
        {session ? "Update Session" : "Create Session"}
      </Button>
    </form>
  );
}
