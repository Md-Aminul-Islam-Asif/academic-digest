import { Shell } from "@/components/layout/Shell";
import { useTransactions } from "@/hooks/use-transactions";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function CalendarView() {
  const { data: transactions } = useTransactions();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get days that have due dates
  const dueDates = transactions
    ?.filter(t => t.transaction.status === 'issued')
    .map(t => new Date(t.transaction.dueDate)) || [];

  const selectedDateTransactions = transactions?.filter(t => 
    date && new Date(t.transaction.dueDate).toDateString() === date.toDateString() && t.transaction.status === 'issued'
  ) || [];

  return (
    <Shell>
       <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Track due dates and deadlines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Due Dates</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{
                  due: dueDates
                }}
                modifiersStyles={{
                  due: {
                    color: "white",
                    backgroundColor: "hsl(var(--destructive))",
                    borderRadius: "50%"
                  }
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle>
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateTransactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No books due on this date.</p>
              ) : (
                <div className="space-y-4">
                  {selectedDateTransactions.map(t => (
                    <div key={t.transaction.id} className="flex items-start justify-between border-b border-border/50 pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{t.book.title}</p>
                        <p className="text-sm text-muted-foreground">Borrowed by: {t.user.name}</p>
                      </div>
                      <Badge variant="destructive">Due Today</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
