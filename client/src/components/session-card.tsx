import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SessionForm from "./session-form";
import type { SelectSession } from "@db/schema";
import { format } from "date-fns";

type SessionCardProps = {
  session: SelectSession;
  onUpdate?: (session: SelectSession) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  showActions?: boolean;
};

export default function SessionCard({
  session,
  onUpdate,
  onDelete,
  showActions = false,
}: SessionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Session #{session.sessionNumber}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {format(new Date(session.sessionDate), "PPP")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Attendance</h3>
          <p className="text-sm text-muted-foreground">
            {session.attendance.split(",").join(", ")}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Topics</h3>
          <p className="text-sm text-muted-foreground">{session.topics}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Homework</h3>
          <p className="text-sm text-muted-foreground">{session.homework}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Game Analysis</h3>
          <p className="text-sm text-muted-foreground">{session.gameAnalysis}</p>
        </div>
      </CardContent>
      {showActions && onUpdate && onDelete && (
        <CardFooter className="gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <SessionForm
                session={session}
                onSubmit={(data) => onUpdate({ ...session, ...data })}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Session</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete session #{session.sessionNumber}?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(session.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  );
}
