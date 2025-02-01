import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { InsertTimeSlot, SelectTimeSlot } from "@db/schema";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type TimeSlotFormProps = {
  timeSlot?: SelectTimeSlot;
  onSubmit: (
    data: Omit<InsertTimeSlot, "id" | "coachId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
};

export default function TimeSlotForm({ timeSlot, onSubmit }: TimeSlotFormProps) {
  const form = useForm({
    defaultValues: timeSlot
      ? {
          startTime: new Date(timeSlot.startTime).toISOString().slice(0, 16),
          endTime: new Date(timeSlot.endTime).toISOString().slice(0, 16),
          dayOfWeek: timeSlot.dayOfWeek,
          isRecurring: timeSlot.isRecurring,
          isBooked: timeSlot.isBooked,
        }
      : {
          startTime: new Date().toISOString().slice(0, 16),
          endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
          dayOfWeek: new Date().getDay(),
          isRecurring: true,
          isBooked: false,
        },
  });

  const handleSubmit = async (
    data: Omit<InsertTimeSlot, "id" | "coachId" | "createdAt" | "updatedAt">
  ) => {
    try {
      await onSubmit({
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      });
      form.reset();
    } catch (error) {
      console.error("Failed to submit time slot:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {timeSlot ? "Edit Time Slot" : "Create New Time Slot"}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="datetime-local"
            {...form.register("startTime", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="datetime-local"
            {...form.register("endTime", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dayOfWeek">Day of Week</Label>
          <select
            id="dayOfWeek"
            className="w-full p-2 border rounded"
            {...form.register("dayOfWeek", { required: true })}
          >
            {DAYS_OF_WEEK.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isRecurring"
            checked={form.watch("isRecurring")}
            onCheckedChange={(checked) =>
              form.setValue("isRecurring", checked)
            }
          />
          <Label htmlFor="isRecurring">Recurring Weekly</Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {timeSlot ? "Update Time Slot" : "Create Time Slot"}
      </Button>
    </form>
  );
}
