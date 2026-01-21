import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import {
  useTransactions,
  useIssueBook,
  useReturnBook,
} from "@/hooks/use-transactions";
import { useBooks } from "@/hooks/use-books";
import { useStudents } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, RotateCcw, Clock, BookOpen, User } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

/* =========================
   Utils (🔥 SAFE)
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">
              Issue and return books
            </p>
          </div>
          <IssueBookDialog />
        </div>

        {/* Table */}
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
              ) : !transactions || transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t: any) => {
                  // 🔥 MOST IMPORTANT FIX
                  const tx = t.transaction ?? t;
                  const book = t.book ?? {};
                  const user = t.user ?? {};

                  if (!tx?.id) return null;

                  return (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs">
                        #{tx.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {book.title ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{user.name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email ?? ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{safeDate(tx.issueDate)}</TableCell>
                      <TableCell>{safeDate(tx.dueDate)}</TableCell>
                      <TableCell>
                        {tx.status === "issued" ? (
                          <span className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800">
                            Issued
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
                            Returned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {tx.status === "issued" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => returnBook.mutate(tx.id)}
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
   Issue Book Dialog (🔥 UX FIXED)
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
        toast({
          title: "Book Issued",
          description: "Transaction added successfully",
        });
        form.reset();
        setOpen(false);
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Issue Failed",
          description: err.message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Issue Book
        </Button>
      </DialogTrigger>

      <DialogContent className="glass-card">
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
                    {students?.length ? (
                      students.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name} ({s.email})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No students found
                      </div>
                    )}
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
                    <SelectValue placeholder="Select available book" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBooks.length ? (
                      availableBooks.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.title} ({b.available} left)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No books available
                      </div>
                    )}
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
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {field.value
                        ? format(field.value, "PPP")
                        : "Pick a due date"}
                      <Clock className="h-4 w-4 opacity-50" />
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

          <Button type="submit" className="w-full" disabled={issueBook.isPending}>
            {issueBook.isPending ? "Issuing..." : "Confirm Issue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
