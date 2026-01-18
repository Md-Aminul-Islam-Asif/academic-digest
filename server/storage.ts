
import { db } from "./db";
import { 
  users, books, transactions, discounts, feedbacks,
  type User, type InsertUser, type Book, type InsertBook,
  type Transaction, type InsertTransaction, type Discount, 
  type InsertDiscount, type Feedback, type InsertFeedback,
  type BookStats
} from "@shared/schema";
import { eq, count, sql, desc, and } from "drizzle-orm";

import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  sessionStore: session.Store;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getStudents(): Promise<User[]>;

  // Books
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<void>;
  
  // Transactions
  getTransactions(): Promise<(Transaction & { book: Book, user: User })[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  returnTransaction(id: number): Promise<Transaction | undefined>;
  
  // Stats
  getStats(): Promise<BookStats>;

  // Discounts
  getDiscounts(): Promise<Discount[]>;
  createDiscount(discount: InsertDiscount): Promise<Discount>;

  // Feedback
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

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getStudents(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "student"));
  }

  async getBooks(): Promise<Book[]> {
    return await db.select().from(books).orderBy(desc(books.createdAt));
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }

  async updateBook(id: number, updates: Partial<InsertBook>): Promise<Book | undefined> {
    const [book] = await db.update(books).set(updates).where(eq(books.id, id)).returning();
    return book;
  }

  async deleteBook(id: number): Promise<void> {
    await db.delete(books).where(eq(books.id, id));
  }

  async getTransactions(): Promise<(Transaction & { book: Book, user: User })[]> {
    const rows = await db
      .select({
        transaction: transactions,
        book: books,
        user: users,
      })
      .from(transactions)
      .innerJoin(books, eq(transactions.bookId, books.id))
      .innerJoin(users, eq(transactions.userId, users.id))
      .orderBy(desc(transactions.issueDate));
      
    return rows.map(r => ({ ...r.transaction, book: r.book, user: r.user }));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    return await db.transaction(async (tx) => {
      // Create transaction
      const [t] = await tx.insert(transactions).values(insertTransaction).returning();
      
      // Decrease available book quantity
      await tx.update(books)
        .set({ available: sql`${books.available} - 1` })
        .where(eq(books.id, insertTransaction.bookId));
        
      return t;
    });
  }

  async returnTransaction(id: number): Promise<Transaction | undefined> {
    return await db.transaction(async (tx) => {
      const [t] = await tx
        .update(transactions)
        .set({ 
          status: "returned",
          returnDate: new Date()
        })
        .where(eq(transactions.id, id))
        .returning();
        
      if (t) {
        // Increase available book quantity
        await tx.update(books)
          .set({ available: sql`${books.available} + 1` })
          .where(eq(books.id, t.bookId));
      }
      
      return t;
    });
  }

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

  async getDiscounts(): Promise<Discount[]> {
    return await db.select().from(discounts).orderBy(desc(discounts.validUntil));
  }

  async createDiscount(insertDiscount: InsertDiscount): Promise<Discount> {
    const [discount] = await db.insert(discounts).values(insertDiscount).returning();
    return discount;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedback] = await db.insert(feedbacks).values(insertFeedback).returning();
    return feedback;
  }
}

export const storage = new DatabaseStorage();
