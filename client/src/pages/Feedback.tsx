import { Shell } from "@/components/layout/Shell";
import { useCreateFeedback } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFeedbackSchema, type InsertFeedback } from "@shared/routes";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Feedback() {
  const createFeedback = useCreateFeedback();
  const { toast } = useToast();
  
  const form = useForm<InsertFeedback>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertFeedback) => {
    createFeedback.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Feedback Sent",
          description: "Thank you for your feedback!",
        });
        form.reset();
      }
    });
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-foreground">Feedback</h1>
          <p className="text-muted-foreground mt-2">Help us improve the library system.</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Send us a message
            </CardTitle>
            <CardDescription>We appreciate your suggestions</CardDescription>
          </CardHeader>
          <CardContent>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input {...form.register("name")} placeholder="Your Name" />
                {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register("email")} placeholder="your@email.com" />
                {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea 
                  {...form.register("message")} 
                  placeholder="Tell us what you think..." 
                  className="min-h-[120px]"
                />
                {form.formState.errors.message && <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={createFeedback.isPending}>
                {createFeedback.isPending ? "Sending..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
