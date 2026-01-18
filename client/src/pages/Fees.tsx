import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function Fees() {
  const [daysOverdue, setDaysOverdue] = useState<number>(0);
  const [dailyFine, setDailyFine] = useState<number>(5);
  const [totalFine, setTotalFine] = useState<number | null>(null);

  const calculate = () => {
    setTotalFine(daysOverdue * dailyFine);
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground">Fee Calculator</h1>
          <p className="text-muted-foreground mt-2">Calculate overdue fines quickly.</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Fine Estimator
            </CardTitle>
            <CardDescription>Enter details to see total owed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Days Overdue</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={daysOverdue}
                  onChange={(e) => setDaysOverdue(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>Fine Per Day ($)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={dailyFine}
                  onChange={(e) => setDailyFine(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
            </div>

            <Button onClick={calculate} className="w-full text-lg h-12">
              Calculate Total
            </Button>

            {totalFine !== null && (
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center animate-in zoom-in-95 duration-300">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Total Fine Amount</p>
                <p className="text-4xl font-bold text-primary mt-2">
                  ${totalFine.toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
