import { useState } from "react";
import { Shell } from "@/components/layout/shell";

import {
  useTransactions,
  useIssueBook,
  useReturnBook,
} from "../hooks/use-transactions";
import { useBooks } from "../hooks/use-books";
import { useStudents } from "../hooks/use-misc";
import { useToast } from "../hooks/use-toast";

import {
  Button,
  Label,
  Calendar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

import { Plus, RotateCcw, Clock, BookOpen, User } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { motion } from "framer-motion";

/* =========================
   Utils
   ========================= */
function safeDate(value: any) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "—" : format(d, "MMM d, yyyy");
}

/* =========================
   Schema
   ========================= */
const issueSchema = z.object({
  userId: z.coerce.number().min(1),
  bookId: z.coerce.number().min(1),
  dueDate: z.date(),
});

type IssueForm = z.infer<typeof issueSchema>;

/* =========================
   Page
   ========================= */
export default function Transactions() {
  const { data: transactions, isLoading } = useTransactions();
  const returnBook = useReturnBook();

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Issue and return books
            </p>
          </div>
          <IssueBookDialog />
        </div>

        <div className="glass-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : !transactions?.length ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t: any) => {
                  const tx = t.transaction ?? t;
                  const book = t.book ?? {};
                  const user = t.user ?? {};
                  if (!tx?.id) return null;

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">
                        #{tx.id}
                      </TableCell>
                      <TableCell>{book.title ?? "—"}</TableCell>
                      <TableCell>
                        <p>{user.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email ?? ""}
                        </p>
                      </TableCell>
                      <TableCell>{safeDate(tx.issueDate)}</TableCell>
                      <TableCell>{safeDate(tx.dueDate)}</TableCell>
                      <TableCell>
                        {tx.status === "issued" ? (
                          <span className="badge-warning">Issued</span>
                        ) : (
                          <span className="badge-success">Returned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {tx.status === "issued" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              returnBook.mutate(tx.id)
                            }
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Return
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </Shell>
  );
}

/* =========================
   Issue Book Dialog
   ========================= */
function IssueBookDialog() {
  const [open, setOpen] = useState(false);
  const { data: books } = useBooks();
  const { data: students } = useStudents();
  const issueBook = useIssueBook();
  const { toast } = useToast();

  const form = useForm<IssueForm>({
    resolver: zodResolver(issueSchema),
  });

  const availableBooks = books?.filter((b) => b.available > 0) ?? [];

  const onSubmit = (data: IssueForm) => {
    issueBook.mutate(data, {
      onSuccess: () => {
        toast({ title: "Book Issued" });
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Issue Book
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Student */}
          <div className="space-y-2">
            <Label>Student</Label>
            <Controller
              name="userId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <User className="h-4 w-4 mr-2 opacity-50" />
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={String(s.id)}
                      >
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Book */}
          <div className="space-y-2">
            <Label>Book</Label>
            <Controller
              name="bookId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <BookOpen className="h-4 w-4 mr-2 opacity-50" />
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBooks.map((b) => (
                      <SelectItem
                        key={b.id}
                        value={String(b.id)}
                      >
                        {b.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {field.value
                        ? format(field.value, "PPP")
                        : "Pick date"}
                      <Clock className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={issueBook.isPending}
          >
            Confirm Issue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
