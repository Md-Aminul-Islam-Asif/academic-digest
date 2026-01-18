import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">University Library</h1>
          <p className="text-muted-foreground">Sign in to access library services</p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email Address</Label>
                <Input 
                  id="username" 
                  type="email" 
                  placeholder="student@university.edu" 
                  {...form.register("username")} 
                />
                {form.formState.errors.username && (
                  <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  {...form.register("password")} 
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full font-semibold" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/40 pt-4 bg-muted/10">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="text-primary hover:underline cursor-pointer font-medium">Register here</span>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
