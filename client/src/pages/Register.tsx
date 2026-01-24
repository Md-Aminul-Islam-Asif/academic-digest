// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useAuth } from "@/hooks/use-auth";
// import { Link } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { BookOpen } from "lucide-react";

// // ✅ FIXED IMPORT
// import { insertUserSchema } from "@shared/routes";

// const registerSchema = insertUserSchema
//   .extend({
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// type RegisterForm = z.infer<typeof registerSchema>;

// export default function Register() {
//   const { register, isRegistering } = useAuth();

//   const form = useForm<RegisterForm>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       role: "student",
//       studentId: "",
//     },
//   });

//   const onSubmit = (data: RegisterForm) => {
//     const { confirmPassword, ...requestData } = data;
//     register(requestData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-8">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center space-y-2">
//           <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
//             <BookOpen className="h-8 w-8 text-primary" />
//           </div>
//           <h1 className="text-4xl font-display font-bold text-foreground">
//             Join the Library
//           </h1>
//           <p className="text-muted-foreground">
//             Create your academic account
//           </p>
//         </div>

//         <Card className="border-border/50 shadow-xl shadow-primary/5">
//           <CardHeader>
//             <CardTitle>Create Account</CardTitle>
//             <CardDescription>
//               Fill in your details to register
//             </CardDescription>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input id="name" {...form.register("name")} />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   {...form.register("email")}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="studentId">Student ID (Optional)</Label>
//                 <Input id="studentId" {...form.register("studentId")} />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Password</Label>
//                   <Input
//                     type="password"
//                     {...form.register("password")}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Confirm</Label>
//                   <Input
//                     type="password"
//                     {...form.register("confirmPassword")}
//                   />
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={isRegistering}
//               >
//                 {isRegistering ? "Creating Account..." : "Register"}
//               </Button>
//             </form>
//           </CardContent>

//           <CardFooter className="justify-center border-t pt-4">
//             <p className="text-sm text-muted-foreground">
//               Already have an account?{" "}
//               <Link href="/login">
//                 <span className="text-primary cursor-pointer">
//                   Sign in
//                 </span>
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/use-auth";

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

// ✅ FIXED IMPORT
import { insertUserSchema } from "../shared/routes";


const registerSchema = insertUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, isRegistering } = useAuth();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      studentId: "",
    },
  });

  const onSubmit = (data: RegisterForm) => {
    const { confirmPassword, ...requestData } = data;
    register(requestData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Join the Library
          </h1>
          <p className="text-muted-foreground">
            Create your academic account
          </p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to register
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...form.register("name")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID (Optional)</Label>
                <Input id="studentId" {...form.register("studentId")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    {...form.register("password")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confirm</Label>
                  <Input
                    type="password"
                    {...form.register("confirmPassword")}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? "Creating Account..." : "Register"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary cursor-pointer">
                  Sign in
                </span>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
