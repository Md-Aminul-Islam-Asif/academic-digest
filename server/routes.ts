
import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

import { hashPassword } from "./auth";

async function seed() {
  const existingUsers = await storage.getStudents();
  if (existingUsers.length === 0) {
    const password = await hashPassword("password123");
    await storage.createUser({
      name: "Admin User",
      email: "admin@library.edu",
      password,
      role: "admin",
      studentId: null,
    });
    await storage.createUser({
      name: "John Doe",
      email: "john@student.edu",
      password,
      role: "student",
      studentId: "STU001",
    });
  }

  const existingBooks = await storage.getBooks();
  if (existingBooks.length === 0) {
    await storage.createBook({
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      category: "Computer Science",
      quantity: 5,
      available: 5,
    });
    await storage.createBook({
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Software Engineering",
      quantity: 3,
      available: 3,
    });
    await storage.createBook({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Literature",
      quantity: 2,
      available: 2,
    });
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Seed data
  seed().catch(console.error);

  // Stats
  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Books
  app.get(api.books.list.path, async (req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.post(api.books.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.books.create.input.parse(req.body);
      const book = await storage.createBook(input);
      res.status(201).json(book);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.put(api.books.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.books.update.input.parse(req.body);
      const book = await storage.updateBook(Number(req.params.id), input);
      if (!book) return res.sendStatus(404);
      res.json(book);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete(api.books.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteBook(Number(req.params.id));
    res.sendStatus(204);
  });

  // Students
  app.get(api.students.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const students = await storage.getStudents();
    res.json(students);
  });

  // Transactions
  app.get(api.transactions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.post(api.transactions.issue.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.transactions.issue.input.parse(req.body);
      const transaction = await storage.createTransaction(input);
      res.status(201).json(transaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.transactions.return.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transaction = await storage.returnTransaction(Number(req.params.id));
    if (!transaction) return res.sendStatus(404);
    res.json(transaction);
  });

  // Discounts
  app.get(api.discounts.list.path, async (req, res) => {
    const discounts = await storage.getDiscounts();
    res.json(discounts);
  });

  app.post(api.discounts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.discounts.create.input.parse(req.body);
      const discount = await storage.createDiscount(input);
      res.status(201).json(discount);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Feedback
  app.post(api.feedbacks.create.path, async (req, res) => {
    try {
      const input = api.feedbacks.create.input.parse(req.body);
      const feedback = await storage.createFeedback(input);
      res.status(201).json(feedback);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
