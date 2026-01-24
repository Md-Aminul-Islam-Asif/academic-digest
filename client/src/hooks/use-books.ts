// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api, buildUrl, type InsertBook } from "@shared/routes";

// export function useBooks() {
//   return useQuery({
//     queryKey: [api.books.list.path],
//     queryFn: async () => {
//       const res = await fetch(api.books.list.path, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch books");
//       return api.books.list.responses[200].parse(await res.json());
//     },
//   });
// }

// export function useCreateBook() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (book: InsertBook) => {
//       const res = await fetch(api.books.create.path, {
//         method: api.books.create.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(book),
//         credentials: "include",
//       });
//       if (!res.ok) {
//         if (res.status === 400) {
//           const error = api.books.create.responses[400].parse(await res.json());
//           throw new Error(error.message);
//         }
//         throw new Error("Failed to create book");
//       }
//       return api.books.create.responses[201].parse(await res.json());
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
//       queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
//     },
//   });
// }

// export function useUpdateBook() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertBook>) => {
//       const url = buildUrl(api.books.update.path, { id });
//       const res = await fetch(url, {
//         method: api.books.update.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to update book");
//       return api.books.update.responses[200].parse(await res.json());
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.books.list.path] }),
//   });
// }

// export function useDeleteBook() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (id: number) => {
//       const url = buildUrl(api.books.delete.path, { id });
//       const res = await fetch(url, {
//         method: api.books.delete.method,
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to delete book");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
//       queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
//     },
//   });
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBook } from "../shared/routes";

/* =========================
   Fetch Books
   ========================= */
export function useBooks() {
  return useQuery({
    queryKey: [api.books.list.path],
    queryFn: async () => {
      const res = await fetch(api.books.list.path, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await res.json();

      // 🔥 CRITICAL SAFETY
      return Array.isArray(data)
        ? api.books.list.responses[200].parse(data)
        : [];
    },
  });
}

/* =========================
   Create Book
   ========================= */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (book: InsertBook) => {
      const res = await fetch(api.books.create.path, {
        method: api.books.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.books.create.responses[400].parse(
            await res.json()
          );
          throw new Error(error.message);
        }
        throw new Error("Failed to create book");
      }

      return api.books.create.responses[201].parse(
        await res.json()
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.books.list.path],
      });
      queryClient.invalidateQueries({
        queryKey: [api.stats.get.path],
      });
    },
  });
}

/* =========================
   Update Book
   ========================= */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: { id: number } & Partial<InsertBook>) => {
      const url = buildUrl(api.books.update.path, { id });

      const res = await fetch(url, {
        method: api.books.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update book");
      }

      return api.books.update.responses[200].parse(
        await res.json()
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.books.list.path],
      });
    },
  });
}

/* =========================
   Delete Book
   ========================= */
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.books.delete.path, { id });

      const res = await fetch(url, {
        method: api.books.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete book");
      }

      return true; // 🔥 important for react-query stability
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.books.list.path],
      });
      queryClient.invalidateQueries({
        queryKey: [api.stats.get.path],
      });
    },
  });
}
