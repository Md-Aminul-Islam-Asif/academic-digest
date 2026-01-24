// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api, type InsertDiscount, type InsertFeedback } from "@shared/routes";

// export function useStats() {
//   return useQuery({
//     queryKey: [api.stats.get.path],
//     queryFn: async () => {
//       const res = await fetch(api.stats.get.path, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch stats");
//       return api.stats.get.responses[200].parse(await res.json());
//     },
//   });
// }

// export function useStudents() {
//   return useQuery({
//     queryKey: [api.students.list.path],
//     queryFn: async () => {
//       const res = await fetch(api.students.list.path, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch students");
//       return api.students.list.responses[200].parse(await res.json());
//     },
//   });
// }

// export function useDiscounts() {
//   return useQuery({
//     queryKey: [api.discounts.list.path],
//     queryFn: async () => {
//       const res = await fetch(api.discounts.list.path, { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch discounts");
//       return api.discounts.list.responses[200].parse(await res.json());
//     },
//   });
// }

// export function useCreateDiscount() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: InsertDiscount) => {
//       const res = await fetch(api.discounts.create.path, {
//         method: api.discounts.create.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to create discount");
//       return api.discounts.create.responses[201].parse(await res.json());
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.discounts.list.path] }),
//   });
// }

// export function useCreateFeedback() {
//   return useMutation({
//     mutationFn: async (data: InsertFeedback) => {
//       const res = await fetch(api.feedbacks.create.path, {
//         method: api.feedbacks.create.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to send feedback");
//       return api.feedbacks.create.responses[201].parse(await res.json());
//     },
//   });
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertDiscount, type InsertFeedback } from "../shared/routes";

/* =========================
   Stats
   ========================= */
export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch stats");
      }

      return api.stats.get.responses[200].parse(
        await res.json()
      );
    },
  });
}

/* =========================
   Students
   ========================= */
export function useStudents() {
  return useQuery({
    queryKey: [api.students.list.path],
    queryFn: async () => {
      const res = await fetch(api.students.list.path, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await res.json();

      // 🔥 SAFE: always return array
      return Array.isArray(data)
        ? api.students.list.responses[200].parse(data)
        : [];
    },
  });
}

/* =========================
   Discounts
   ========================= */
export function useDiscounts() {
  return useQuery({
    queryKey: [api.discounts.list.path],
    queryFn: async () => {
      const res = await fetch(api.discounts.list.path, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch discounts");
      }

      const data = await res.json();

      // 🔥 FIX for discounts.map error
      return Array.isArray(data)
        ? api.discounts.list.responses[200].parse(data)
        : [];
    },
  });
}

/* =========================
   Create Discount
   ========================= */
export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertDiscount) => {
      const res = await fetch(api.discounts.create.path, {
        method: api.discounts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to create discount");
      }

      return api.discounts.create.responses[201].parse(
        await res.json()
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.discounts.list.path],
      });
    },
  });
}

/* =========================
   Create Feedback
   ========================= */
export function useCreateFeedback() {
  return useMutation({
    mutationFn: async (data: InsertFeedback) => {
      const res = await fetch(api.feedbacks.create.path, {
        method: api.feedbacks.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to send feedback");
      }

      return api.feedbacks.create.responses[201].parse(
        await res.json()
      );
    },
  });
}
