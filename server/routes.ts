import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { sendFeedbackMail } from "./mail";

/* =========================
   REGISTER EXPRESS ROUTES
   ========================= */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /* ---------- AUTH ---------- */
  setupAuth(app);

  /* ---------- STATS ---------- */
  app.get(api.stats.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stats = await storage.getStats();
    res.json(stats);
  });

  /* ---------- BOOKS ---------- */
  app.get(api.books.list.path, async (_req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.post(api.books.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.books.create.input.parse(req.body);
    const book = await storage.createBook(input);
    res.status(201).json(book);
  });

  app.put(api.books.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.books.update.input.parse(req.body);
    const book = await storage.updateBook(Number(req.params.id), input);
    if (!book) return res.sendStatus(404);
    res.json(book);
  });

  app.delete(api.books.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteBook(Number(req.params.id));
    res.sendStatus(204);
  });

  /* ---------- STUDENTS ---------- */
  app.get(api.students.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const students = await storage.getStudents();
    res.json(students);
  });

  /* ---------- TRANSACTIONS ---------- */
  app.get(api.transactions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  app.post(api.transactions.issue.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.transactions.issue.input.parse(req.body);
    const transaction = await storage.createTransaction(input);
    res.status(201).json(transaction);
  });

  app.post(api.transactions.return.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transaction = await storage.returnTransaction(Number(req.params.id));
    if (!transaction) return res.sendStatus(404);
    res.json(transaction);
  });

  /* ---------- DISCOUNTS ---------- */
  app.get(api.discounts.list.path, async (_req, res) => {
    const discounts = await storage.getDiscounts();
    res.json(discounts);
  });

  app.post(api.discounts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.discounts.create.input.parse(req.body);
    const discount = await storage.createDiscount(input);
    res.status(201).json(discount);
  });

  /* ---------- FEEDBACK (MAIL FIXED) ---------- */
  app.post(api.feedbacks.create.path, async (req, res) => {
    try {
      const input = api.feedbacks.create.input.parse(req.body);

      await storage.createFeedback(input);

      try {
        await sendFeedbackMail(
          input.name,
          input.email,
          input.message
        );
      } catch (mailErr) {
        console.error("Mail failed:", mailErr);
      }

      res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
