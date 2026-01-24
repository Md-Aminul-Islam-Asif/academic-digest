import { useState } from "react";
import { Shell } from "@/components/layout/shell";
import { useDiscounts, useCreateDiscount } from "../hooks/use-misc";

import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Calendar,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";

import { Plus, Tag } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  insertDiscountSchema,
  type InsertDiscount,
} from "@/shared/routes";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Discounts() {
  const { data: discounts = [], isLoading } = useDiscounts();

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Discounts</h1>
            <p className="text-muted-foreground">
              Manage active promotions
            </p>
          </div>
          <AddDiscountDialog />
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : discounts.length === 0 ? (
            <p className="text-muted-foreground">
              No active discounts.
            </p>
          ) : (
            discounts.map((discount) => (
              <Card
                key={discount.id}
                className="border-l-4 border-l-primary"
              >
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
                    <span>
                      Valid until{" "}
                      {format(
                        new Date(discount.validUntil),
                        "MMM d, yyyy"
                      )}
                    </span>
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

/* =========================
   Add Discount Dialog
   ========================= */

function AddDiscountDialog() {
  const [open, setOpen] = useState(false);
  const createDiscount = useCreateDiscount();

  const form = useForm<InsertDiscount>({
    resolver: zodResolver(insertDiscountSchema),
    defaultValues: {
      title: "",
      percentage: 10,
      active: true,
    },
  });

  const onSubmit = (data: InsertDiscount) => {
    createDiscount.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Discount
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Discount</DialogTitle>
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
            <Label>Percentage</Label>
            <Input
              type="number"
              min={1}
              max={100}
              {...form.register("percentage", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Controller
              control={form.control}
              name="validUntil"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        !field.value &&
                          "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(
                            new Date(field.value),
                            "PPP"
                          )
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? new Date(field.value)
                          : undefined
                      }
                      onSelect={(date) =>
                        field.onChange(
                          date?.toISOString()
                        )
                      }
                      disabled={(date) =>
                        date < new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createDiscount.isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
