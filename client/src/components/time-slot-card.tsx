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
import TimeSlotForm from "./time-slot-form";
import type { SelectTimeSlot } from "@db/schema";
import { format } from "date-fns";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type TimeSlotCardProps = {
  timeSlot: SelectTimeSlot;
  onUpdate?: (timeSlot: SelectTimeSlot) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  showActions?: boolean;
};

export default function TimeSlotCard({
  timeSlot,
  onUpdate,
  onDelete,
  showActions = false,
}: TimeSlotCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{DAYS_OF_WEEK[timeSlot.dayOfWeek]}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {timeSlot.isRecurring ? "Recurring" : "One-time"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Time</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(timeSlot.startTime), "h:mm a")} -{" "}
            {format(new Date(timeSlot.endTime), "h:mm a")}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Date</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(timeSlot.startTime), "PPP")}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Status</h3>
          <p className="text-sm text-muted-foreground">
            {timeSlot.isBooked ? "Booked" : "Available"}
          </p>
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
              <TimeSlotForm
                timeSlot={timeSlot}
                onSubmit={(data) => onUpdate({ ...timeSlot, ...data })}
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
                <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this time slot? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(timeSlot.id)}
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
