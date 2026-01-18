import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useDiscounts, useCreateDiscount } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Percent, Plus, Tag } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDiscountSchema, type InsertDiscount } from "@shared/routes";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function Discounts() {
  const { data: discounts, isLoading } = useDiscounts();

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Discounts</h1>
            <p className="text-muted-foreground">Manage active promotions</p>
          </div>
          <AddDiscountDialog />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : discounts?.length === 0 ? (
            <p className="text-muted-foreground">No active discounts.</p>
          ) : (
            discounts?.map((discount) => (
              <Card key={discount.id} className="hover-card border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {discount.title}
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-bold">
                      {discount.percentage}% OFF
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Valid until: {format(new Date(discount.validUntil), 'MMM d, yyyy')}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}

function AddDiscountDialog() {
  const [open, setOpen] = useState(false);
  const createDiscount = useCreateDiscount();
  
  const form = useForm<InsertDiscount>({
    resolver: zodResolver(insertDiscountSchema),
    defaultValues: {
      title: "",
      percentage: 10,
      active: true,
    }
  });

  const onSubmit = (data: InsertDiscount) => {
    createDiscount.mutate(data, {
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
          <Plus className="h-4 w-4" /> Add Discount
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Discount</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...form.register("title")} placeholder="Semester Start Sale" />
             {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Percentage (%)</Label>
            <Input 
              type="number" 
              {...form.register("percentage", { valueAsNumber: true })} 
              min={1} max={100}
            />
             {form.formState.errors.percentage && <p className="text-xs text-destructive">{form.formState.errors.percentage.message}</p>}
          </div>
          
           <div className="space-y-2 flex flex-col">
            <Label>Valid Until</Label>
            <Controller
              control={form.control}
              name="validUntil"
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
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Tag className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
             {form.formState.errors.validUntil && <p className="text-xs text-destructive">{form.formState.errors.validUntil.message}</p>}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createDiscount.isPending}>
              {createDiscount.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
