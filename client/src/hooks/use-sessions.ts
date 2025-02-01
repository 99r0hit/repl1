import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InsertSession, SelectSession } from "@db/schema";

export function useSessions() {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery<SelectSession[]>({
    queryKey: ["/api/sessions"],
  });

  const createSession = useMutation({
    mutationFn: async (session: Omit<InsertSession, "id" | "coachId">) => {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({
      id,
      ...session
    }: Omit<InsertSession, "coachId"> & { id: number }) => {
      const res = await fetch(`/api/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  return {
    sessions,
    isLoading,
    createSession: createSession.mutateAsync,
    updateSession: updateSession.mutateAsync,
    deleteSession: deleteSession.mutateAsync,
  };
}
