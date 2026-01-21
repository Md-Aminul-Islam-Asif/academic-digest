// import { useState } from "react";
// import { Shell } from "@/components/layout/Shell";
// import { useBooks, useCreateBook, useDeleteBook } from "@/hooks/use-books";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger 
// } from "@/components/ui/dialog";
// import { Plus, Search, Trash2, Edit2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { insertBookSchema, type InsertBook } from "@shared/routes";
// import { Label } from "@/components/ui/label";

// export default function Books() {
//   const { data: books, isLoading } = useBooks();
//   const [search, setSearch] = useState("");
//   const deleteBook = useDeleteBook();

//   const filteredBooks = books?.filter(book => 
//     book.title.toLowerCase().includes(search.toLowerCase()) || 
//     book.author.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <Shell>
//       <div className="space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-display font-bold text-foreground">Books Catalog</h1>
//             <p className="text-muted-foreground">Manage library inventory</p>
//           </div>
//           <AddBookDialog />
//         </div>

//         <div className="flex items-center gap-2 max-w-sm bg-background border border-border rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
//           <Search className="h-4 w-4 text-muted-foreground" />
//           <input 
//             className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
//             placeholder="Search by title or author..." 
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
//           <Table>
//             <TableHeader className="bg-muted/30">
//               <TableRow>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Author</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead className="text-center">Total</TableHead>
//                 <TableHead className="text-center">Available</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading books...</TableCell>
//                 </TableRow>
//               ) : filteredBooks?.length === 0 ? (
//                  <TableRow>
//                   <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No books found.</TableCell>
//                 </TableRow>
//               ) : (
//                 filteredBooks?.map((book) => (
//                   <TableRow key={book.id}>
//                     <TableCell className="font-medium">{book.title}</TableCell>
//                     <TableCell>{book.author}</TableCell>
//                     <TableCell>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
//                         {book.category}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-center">{book.quantity}</TableCell>
//                     <TableCell className="text-center">
//                       <span className={book.available > 0 ? "text-green-600 font-medium" : "text-destructive font-medium"}>
//                         {book.available}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="h-8 w-8 text-muted-foreground hover:text-destructive"
//                         onClick={() => {
//                           if(confirm("Are you sure you want to delete this book?")) {
//                             deleteBook.mutate(book.id);
//                           }
//                         }}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </Shell>
//   );
// }

// function AddBookDialog() {
//   const [open, setOpen] = useState(false);
//   const createBook = useCreateBook();
  
//   const form = useForm<InsertBook>({
//     resolver: zodResolver(insertBookSchema),
//     defaultValues: {
//       title: "",
//       author: "",
//       category: "",
//       quantity: 1,
//       available: 1
//     }
//   });

//   const onSubmit = (data: InsertBook) => {
//     // Ensure available matches quantity initially
//     createBook.mutate({ ...data, available: data.quantity }, {
//       onSuccess: () => {
//         setOpen(false);
//         form.reset();
//       }
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="gap-2 shadow-lg shadow-primary/20">
//           <Plus className="h-4 w-4" /> Add Book
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add New Book</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
//           <div className="space-y-2">
//             <Label>Title</Label>
//             <Input {...form.register("title")} placeholder="Book Title" />
//              {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
//           </div>
//           <div className="space-y-2">
//             <Label>Author</Label>
//             <Input {...form.register("author")} placeholder="Author Name" />
//              {form.formState.errors.author && <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>}
//           </div>
//           <div className="space-y-2">
//             <Label>Category</Label>
//             <Input {...form.register("category")} placeholder="Fiction, Science, History..." />
//              {form.formState.errors.category && <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>}
//           </div>
//           <div className="space-y-2">
//             <Label>Quantity</Label>
//             <Input 
//               type="number" 
//               {...form.register("quantity", { valueAsNumber: true })} 
//               min={1}
//             />
//              {form.formState.errors.quantity && <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>}
//           </div>
//           <div className="pt-2 flex justify-end gap-2">
//             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="submit" disabled={createBook.isPending}>
//               {createBook.isPending ? "Adding..." : "Add Book"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useBooks, useCreateBook, useDeleteBook } from "@/hooks/use-books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ FIXED IMPORT (IMPORTANT)
import { insertBookSchema, type InsertBook } from "@/shared/routes";

import { Label } from "@/components/ui/label";

export default function Books() {
  const { data: books, isLoading } = useBooks();
  const [search, setSearch] = useState("");
  const deleteBook = useDeleteBook();

  const filteredBooks = books?.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Books Catalog
            </h1>
            <p className="text-muted-foreground">
              Manage library inventory
            </p>
          </div>
          <AddBookDialog />
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-sm bg-background border border-border rounded-md px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden shadow-sm bg-card">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading books...
                  </TableCell>
                </TableRow>
              ) : filteredBooks?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No books found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBooks?.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">
                      {book.title}
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {book.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {book.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          book.available > 0
                            ? "text-green-600 font-medium"
                            : "text-destructive font-medium"
                        }
                      >
                        {book.available}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this book?"
                            )
                          ) {
                            deleteBook.mutate(book.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

/* =========================
   Add Book Dialog
   ========================= */
function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const createBook = useCreateBook();

  const form = useForm<InsertBook>({
    resolver: zodResolver(insertBookSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      quantity: 1,
      available: 1,
    },
  });

  const onSubmit = (data: InsertBook) => {
    createBook.mutate(
      { ...data, available: data.quantity },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Add Book
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...form.register("title")} />
          </div>

          <div className="space-y-2">
            <Label>Author</Label>
            <Input {...form.register("author")} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input {...form.register("category")} />
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              {...form.register("quantity", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createBook.isPending}>
              {createBook.isPending ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
