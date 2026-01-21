import { db } from "./db";
import {
  users,
  books,
  transactions,
  discounts,
  feedbacks,
  type User,
  type InsertUser,
  type Book,
  type InsertBook,
  type Transaction,
  type InsertTransaction,
  type Discount,
  type InsertDiscount,
  type Feedback,
  type InsertFeedback,
  type BookStats,
} from "@shared/schema";
import { eq, count, sql, desc } from "drizzle-orm";

import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;

  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getStudents(): Promise<User[]>;

  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<void>;

  // 🔥 IMPORTANT
  getTransactions(): Promise<
    { transaction: Transaction; book: Book; user: User }[]
  >;
  createTransaction(
    transaction: InsertTransaction
  ): Promise<{ transaction: Transaction; book: Book; user: User }>;
  returnTransaction(
    id: number
  ): Promise<{ transaction: Transaction; book: Book; user: User } | undefined>;

  getStats(): Promise<BookStats>;

  getDiscounts(): Promise<Discount[]>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;

  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getStudents() {
    return db.select().from(users).where(eq(users.role, "student"));
  }

  async getBooks() {
    return db.select().from(books).orderBy(desc(books.createdAt));
  }

  async getBook(id: number) {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(insertBook: InsertBook) {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }

  async updateBook(id: number, updates: Partial<InsertBook>) {
    const [book] = await db
      .update(books)
      .set(updates)
      .where(eq(books.id, id))
      .returning();
    return book;
  }

  async deleteBook(id: number) {
    await db.delete(books).where(eq(books.id, id));
  }

  /* =========================
     TRANSACTIONS (FIXED)
     ========================= */

  async getTransactions() {
    return db
      .select({
        transaction: transactions,
        book: books,
        user: users,
      })
      .from(transactions)
      .innerJoin(books, eq(transactions.bookId, books.id))
      .innerJoin(users, eq(transactions.userId, users.id))
      .orderBy(desc(transactions.issueDate));
  }

  async createTransaction(insertTransaction: InsertTransaction) {
    return db.transaction(async (tx) => {
      // 1️⃣ Insert transaction
      const [created] = await tx
        .insert(transactions)
        .values({
          ...insertTransaction,
          status: "issued",
        })
        .returning();

      // 2️⃣ Update book availability
      await tx
        .update(books)
        .set({ available: sql`${books.available} - 1` })
        .where(eq(books.id, insertTransaction.bookId));

      // 3️⃣ RETURN JOINED OBJECT (🔥 CRITICAL FIX)
      const [row] = await tx
        .select({
          transaction: transactions,
          book: books,
          user: users,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(users, eq(transactions.userId, users.id))
        .where(eq(transactions.id, created.id));

      return row;
    });
  }

  async returnTransaction(id: number) {
    return db.transaction(async (tx) => {
      const [updated] = await tx
        .update(transactions)
        .set({
          status: "returned",
          returnDate: new Date(),
        })
        .where(eq(transactions.id, id))
        .returning();

      if (!updated) return undefined;

      await tx
        .update(books)
        .set({ available: sql`${books.available} + 1` })
        .where(eq(books.id, updated.bookId));

      const [row] = await tx
        .select({
          transaction: transactions,
          book: books,
          user: users,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(users, eq(transactions.userId, users.id))
        .where(eq(transactions.id, updated.id));

      return row;
    });
  }

  /* ========================= */

  async getStats(): Promise<BookStats> {
    const [bookStats] = await db
      .select({
        total: sql<number>`sum(${books.quantity})`,
        available: sql<number>`sum(${books.available})`,
      })
      .from(books);

    const [studentStats] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "student"));

    const totalBooks = Number(bookStats?.total || 0);
    const availableBooks = Number(bookStats?.available || 0);

    return {
      totalBooks,
      availableBooks,
      issuedBooks: totalBooks - availableBooks,
      totalStudents: studentStats.count,
    };
  }

  async getDiscounts() {
    return db.select().from(discounts).orderBy(desc(discounts.validUntil));
  }

  async createDiscount(insertDiscount: InsertDiscount) {
    const [discount] = await db
      .insert(discounts)
      .values(insertDiscount)
      .returning();
    return discount;
  }

  async createFeedback(insertFeedback: InsertFeedback) {
    const [feedback] = await db
      .insert(feedbacks)
      .values(insertFeedback)
      .returning();
    return feedback;
  }
}

export const storage = new DatabaseStorage();
