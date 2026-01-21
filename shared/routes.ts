// ✅ shared/routes.ts  (FINAL)

import { z } from "zod";
import {
  insertUserSchema,
  insertBookSchema,
  insertTransactionSchema,
  insertDiscountSchema,
  insertFeedbackSchema,
  users,
  books,
  transactions,
  discounts,
  feedbacks,
} from "./schema";

export * from "./schema";

/* =========================
   Error Schemas
   ========================= */
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

/* =========================
   API CONTRACT
   ========================= */
export const api = {
  auth: {
    login: {
      method: "POST" as const,
      path: "/api/auth/login",
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: "POST" as const,
      path: "/api/auth/register",
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout",
      responses: { 200: z.void() },
    },
    me: {
      method: "GET" as const,
      path: "/api/user",
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },

  stats: {
    get: {
      method: "GET" as const,
      path: "/api/stats",
      responses: {
        200: z.object({
          totalBooks: z.number(),
          issuedBooks: z.number(),
          availableBooks: z.number(),
          totalStudents: z.number(),
        }),
      },
    },
  },

  books: {
    list: {
      method: "GET" as const,
      path: "/api/books",
      responses: {
        200: z.array(z.custom<typeof books.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/books",
      input: insertBookSchema,
      responses: {
        201: z.custom<typeof books.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/books/:id",
      input: insertBookSchema.partial(),
      responses: {
        200: z.custom<typeof books.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/books/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },

  students: {
    list: {
      method: "GET" as const,
      path: "/api/students",
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
  },

  transactions: {
    list: {
      method: "GET" as const,
      path: "/api/transactions",
      responses: {
        200: z.array(
          z.object({
            transaction: z.custom<typeof transactions.$inferSelect>(),
            book: z.custom<typeof books.$inferSelect>(),
            user: z.custom<typeof users.$inferSelect>(),
          })
        ),
      },
    },
    issue: {
      method: "POST" as const,
      path: "/api/transactions/issue",
      input: z.object({
        userId: z.coerce.number(),
        bookId: z.coerce.number(),
        dueDate: z.coerce.date(), // 🔥 FIX
      }),
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    return: {
      method: "POST" as const,
      path: "/api/transactions/:id/return",
      responses: {
        200: z.custom<typeof transactions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },

  discounts: {
    list: {
      method: "GET" as const,
      path: "/api/discounts",
      responses: {
        200: z.array(z.custom<typeof discounts.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/discounts",
      input: insertDiscountSchema,
      responses: {
        201: z.custom<typeof discounts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },

  feedbacks: {
    create: {
      method: "POST" as const,
      path: "/api/feedbacks",
      input: insertFeedbackSchema,
      responses: {
        201: z.custom<typeof feedbacks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

/* =========================
   URL Builder
   ========================= */
export function buildUrl(
  path: string,
  params?: Record<string, string | number>
) {
  let url = path;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url = url.replace(`:${k}`, String(v));
    }
  }
  return url;
}
