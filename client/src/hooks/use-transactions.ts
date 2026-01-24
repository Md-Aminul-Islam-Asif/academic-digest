// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api, buildUrl, type InsertTransaction } from "@shared/routes";

// /* =========================
//    Fetch Transactions
//    ========================= */
// export function useTransactions() {
//   return useQuery({
//     queryKey: ["transactions"],
//     queryFn: async () => {
//       const res = await fetch(api.transactions.list.path, {
//         credentials: "include",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch transactions");
//       }

//       return api.transactions.list.responses[200].parse(await res.json());
//     },
//   });
// }

// /* =========================
//    Issue Book
//    ========================= */
// export function useIssueBook() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data: Omit<InsertTransaction, "status">) => {
//       const res = await fetch(api.transactions.issue.path, {
//         method: api.transactions.issue.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });

//       if (!res.ok) {
//         if (res.status === 400) {
//           const error = api.transactions.issue.responses[400].parse(
//             await res.json()
//           );
//           throw new Error(error.message);
//         }
//         throw new Error("Failed to issue book");
//       }

//       return api.transactions.issue.responses[201].parse(await res.json());
//     },

//     // 🔥 CRITICAL: auto refresh table
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
//       queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
//     },
//   });
// }

// /* =========================
//    Return Book
//    ========================= */
// export function useReturnBook() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id: number) => {
//       const url = buildUrl(api.transactions.return.path, { id });

//       const res = await fetch(url, {
//         method: api.transactions.return.method,
//         credentials: "include",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to return book");
//       }

//       return api.transactions.return.responses[200].parse(await res.json());
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       queryClient.invalidateQueries({ queryKey: [api.books.list.path] });
//       queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
//     },
//   });
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertTransaction } from "../shared/routes";

/* =========================
   Fetch Transactions
   ========================= */
export function useTransactions() {
  return useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();

      // 🔥 VERY IMPORTANT: always return array
      return Array.isArray(data)
        ? api.transactions.list.responses[200].parse(data)
        : [];
    },
  });
}

/* =========================
   Issue Book
   ========================= */
export function useIssueBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<InsertTransaction, "status">
    ) => {
      const res = await fetch(api.transactions.issue.path, {
        method: api.transactions.issue.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error =
            api.transactions.issue.responses[400].parse(
              await res.json()
            );
          throw new Error(error.message);
        }
        throw new Error("Failed to issue book");
      }

      return api.transactions.issue.responses[201].parse(
        await res.json()
      );
    },

    // 🔥 Auto refresh everything related
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.transactions.list.path],
      });
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
   Return Book
   ========================= */
export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.transactions.return.path, { id });

      const res = await fetch(url, {
        method: api.transactions.return.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to return book");
      }

      return api.transactions.return.responses[200].parse(
        await res.json()
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.transactions.list.path],
      });
      queryClient.invalidateQueries({
        queryKey: [api.books.list.path],
      });
      queryClient.invalidateQueries({
        queryKey: [api.stats.get.path],
      });
    },
  });
}
