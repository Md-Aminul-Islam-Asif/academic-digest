import { Shell } from "@/components/layout/shell";
import { useCreateFeedback } from "@/hooks/use-misc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFeedbackSchema, type InsertFeedback } from "../shared/routes";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Feedback() {
  const createFeedback = useCreateFeedback();
  const { toast } = useToast();

  const form = useForm<InsertFeedback>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertFeedback) => {
    createFeedback.mutate(data, {
      onSuccess: () => {
        toast({
          title: "🎉 Feedback Sent",
          description: "Thank you for helping us improve the system.",
          variant: "default",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "❌ Something went wrong",
          description: "Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-display font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Feedback
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Help us improve the library system ✨
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Send us a message
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                We appreciate your suggestions 💙
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    {...form.register("name")}
                    placeholder="Your Name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    {...form.register("email")}
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    {...form.register("message")}
                    placeholder="Tell us what you think..."
                    className="min-h-[120px]"
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                    disabled={createFeedback.isPending}
                  >
                    {createFeedback.isPending
                      ? "Sending..."
                      : "Submit Feedback"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
}
