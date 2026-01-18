
import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === USERS ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"), // 'admin' | 'student'
  studentId: text("student_id"), // Optional, for students
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// === BOOKS ===
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(1),
  available: integer("available").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({ id: true, createdAt: true });

// === TRANSACTIONS (ISSUES) ===
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  issueDate: timestamp("issue_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: text("status").notNull().default("issued"), // 'issued' | 'returned'
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, returnDate: true });

// === DISCOUNTS ===
export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  percentage: integer("percentage").notNull(),
  validUntil: date("valid_until").notNull(),
  active: boolean("active").default(true),
});

export const insertDiscountSchema = createInsertSchema(discounts).omit({ id: true });

// === FEEDBACK ===
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedbacks).omit({ id: true, createdAt: true });

// === RELATIONS ===
export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [transactions.bookId],
    references: [books.id],
  }),
}));

// === TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = z.infer<typeof insertDiscountSchema>;

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// API Specific Types
export type LoginRequest = Pick<InsertUser, "email" | "password">;
export type RegisterRequest = InsertUser;

export type BookStats = {
  totalBooks: number;
  issuedBooks: number;
  availableBooks: number;
  totalStudents: number;
};
