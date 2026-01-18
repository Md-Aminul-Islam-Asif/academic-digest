import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useTransactions, useIssueBook, useReturnBook } from "@/hooks/use-transactions";
import { useBooks } from "@/hooks/use-books";
import { useStudents } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Check, Clock, RotateCcw } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Schema for issuing a book
const issueSchema = z.object({
  userId: z.coerce.number().min(1, "Select a student"),
  bookId: z.coerce.number().min(1, "Select a book"),
  dueDate: z.date({ required_error: "Select a due date" }),
});

type IssueForm = z.infer<typeof issueSchema>;

export default function Transactions() {
  const { data: transactions, isLoading } = useTransactions();
  const returnBook = useReturnBook();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">Issue and return management</p>
          </div>
          <IssueBookDialog />
        </div>

        <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading transactions...</TableCell>
                </TableRow>
              ) : transactions?.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions found.</TableCell>
                </TableRow>
              ) : (
                transactions?.map((item) => (
                  <TableRow key={item.transaction.id}>
                    <TableCell className="font-mono text-xs">#{item.transaction.id}</TableCell>
                    <TableCell className="font-medium">{item.book.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{item.user.name}</span>
                        <span className="text-xs text-muted-foreground">{item.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(item.transaction.issueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(item.transaction.dueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      {item.transaction.status === 'issued' ? (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                           Issued
                         </span>
                      ) : (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                           Returned
                         </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.transaction.status === 'issued' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 text-xs gap-1 hover:bg-primary hover:text-primary-foreground"
                          disabled={returnBook.isPending}
                          onClick={() => returnBook.mutate(item.transaction.id)}
                        >
                          <RotateCcw className="h-3 w-3" /> Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Shell>
  );
}

function IssueBookDialog() {
  const [open, setOpen] = useState(false);
  const { data: books } = useBooks();
  const { data: students } = useStudents();
  const issueBook = useIssueBook();
  
  const form = useForm<IssueForm>({
    resolver: zodResolver(issueSchema),
  });

  const availableBooks = books?.filter(b => b.available > 0) || [];

  const onSubmit = (data: IssueForm) => {
    issueBook.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Issue Book
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-visible">
        <DialogHeader>
          <DialogTitle>Issue Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <Label>Student</Label>
            <Controller
              control={form.control}
              name="userId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name} ({s.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.userId && <p className="text-xs text-destructive">{form.formState.errors.userId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Book</Label>
            <Controller
              control={form.control}
              name="bookId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBooks.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">No books available</div>
                    ) : (
                      availableBooks.map((b) => (
                        <SelectItem key={b.id} value={b.id.toString()}>
                          {b.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.bookId && <p className="text-xs text-destructive">{form.formState.errors.bookId.message}</p>}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Due Date</Label>
            <Controller
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Clock className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
             {form.formState.errors.dueDate && <p className="text-xs text-destructive">{form.formState.errors.dueDate.message}</p>}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={issueBook.isPending}>
              {issueBook.isPending ? "Issuing..." : "Confirm Issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
