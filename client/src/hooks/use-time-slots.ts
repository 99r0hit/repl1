import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InsertTimeSlot, SelectTimeSlot } from "@db/schema";

export function useTimeSlots() {
  const queryClient = useQueryClient();

  const { data: timeSlots = [], isLoading } = useQuery<SelectTimeSlot[]>({
    queryKey: ["/api/time-slots"],
  });

  const { data: coachTimeSlots = [] } = useQuery<SelectTimeSlot[]>({
    queryKey: ["/api/time-slots/coach"],
  });

  const createTimeSlot = useMutation({
    mutationFn: async (timeSlot: Omit<InsertTimeSlot, "id" | "coachId">) => {
      const res = await fetch("/api/time-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeSlot),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots/coach"] });
    },
  });

  const updateTimeSlot = useMutation({
    mutationFn: async ({
      id,
      ...timeSlot
    }: Omit<InsertTimeSlot, "coachId"> & { id: number }) => {
      const res = await fetch(`/api/time-slots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeSlot),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots/coach"] });
    },
  });

  const deleteTimeSlot = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/time-slots/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-slots/coach"] });
    },
  });

  return {
    timeSlots,
    coachTimeSlots,
    isLoading,
    createTimeSlot: createTimeSlot.mutateAsync,
    updateTimeSlot: updateTimeSlot.mutateAsync,
    deleteTimeSlot: deleteTimeSlot.mutateAsync,
  };
}
