// import { Shell } from "@/components/layout/Shell";
// import { useTransactions } from "@/hooks/use-transactions";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { useState } from "react";
// import { format } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { motion } from "framer-motion";
// import { CalendarDays } from "lucide-react";

// export default function CalendarView() {
//   const { data: transactions } = useTransactions();
//   const [date, setDate] = useState<Date | undefined>(new Date());

//   /* =========================
//      FIXED DATA ACCESS
//      ========================= */

//   // All issued book due dates
//   const dueDates =
//     transactions
//       ?.filter((t) => t.status === "issued")
//       .map((t) => new Date(t.dueDate)) || [];

//   // Transactions for selected date
//   const selectedDateTransactions =
//     transactions?.filter(
//       (t) =>
//         date &&
//         t.status === "issued" &&
//         new Date(t.dueDate).toDateString() === date.toDateString()
//     ) || [];

//   return (
//     <Shell>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="space-y-8"
//       >
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-display font-bold text-foreground">
//             Calendar
//           </h1>
//           <p className="text-muted-foreground">
//             Track book return dates and deadlines
//           </p>
//         </div>

//         {/* Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Calendar */}
//           <motion.div whileHover={{ scale: 1.01 }}>
//             <Card className="glass-card">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CalendarDays className="h-5 w-5 text-primary" />
//                   Due Dates
//                 </CardTitle>
//                 <CardDescription>
//                   Highlighted dates indicate pending returns
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex justify-center">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   onSelect={setDate}
//                   modifiers={{ due: dueDates }}
//                   modifiersClassNames={{
//                     due:
//                       "bg-destructive text-white rounded-full font-semibold",
//                   }}
//                   className="rounded-lg border shadow-sm bg-white"
//                 />
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Details */}
//           <motion.div whileHover={{ scale: 1.01 }}>
//             <Card className="glass-card h-full">
//               <CardHeader>
//                 <CardTitle>
//                   {date ? format(date, "MMMM d, yyyy") : "Select a date"}
//                 </CardTitle>
//                 <CardDescription>
//                   Books scheduled for return
//                 </CardDescription>
//               </CardHeader>

//               <CardContent>
//                 {selectedDateTransactions.length === 0 ? (
//                   <p className="text-muted-foreground text-sm">
//                     No books due on this date.
//                   </p>
//                 ) : (
//                   <div className="space-y-4">
//                     {selectedDateTransactions.map((t) => (
//                       <motion.div
//                         key={t.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="flex items-start justify-between border-b border-border/50 pb-4 last:border-0"
//                       >
//                         <div>
//                           <p className="font-medium">{t.book.title}</p>
//                           <p className="text-sm text-muted-foreground">
//                             Borrowed by: {t.user.name}
//                           </p>
//                         </div>
//                         <Badge variant="destructive">Due</Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </motion.div>
//     </Shell>
//   );
// }
import { Shell } from "@/components/layout/shell";
import { useTransactions } from "../hooks/use-transactions";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function CalendarView() {
  const { data: transactions = [] } = useTransactions();
  const [date, setDate] = useState<Date | undefined>(new Date());

  /* =========================
     SAFELY DERIVED DATA
     ========================= */

  // All issued book due dates
  const dueDates: Date[] = transactions
    .filter(
      (t) =>
        t?.transaction &&
        t.transaction.status === "issued" &&
        t.transaction.dueDate
    )
    .map((t) => new Date(t.transaction.dueDate));

  // Transactions for selected date
  const selectedDateTransactions = transactions.filter(
    (t) =>
      date &&
      t?.transaction &&
      t.transaction.status === "issued" &&
      t.transaction.dueDate &&
      new Date(t.transaction.dueDate).toDateString() ===
        date.toDateString()
  );

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Calendar
          </h1>
          <p className="text-muted-foreground">
            Track book return dates and deadlines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Due Dates
              </CardTitle>
              <CardDescription>
                Highlighted dates indicate pending returns
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{ due: dueDates }}
                modifiersClassNames={{
                  due:
                    "bg-destructive text-white rounded-full font-semibold",
                }}
                className="rounded-lg border shadow-sm bg-white"
              />
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
              <CardDescription>
                Books scheduled for return
              </CardDescription>
            </CardHeader>

            <CardContent>
              {selectedDateTransactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No books due on this date.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedDateTransactions.map((t) => (
                    <motion.div
                      key={t.transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start justify-between border-b border-border/50 pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{t.book.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Borrowed by: {t.user.name}
                        </p>
                      </div>
                      <Badge variant="destructive">Due</Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Shell>
  );
}
