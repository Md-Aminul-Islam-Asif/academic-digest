import type React from "react";

import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui_fixed/toaster";


import { useAuth } from "@/hooks/use-auth";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Books from "@/pages/Books";
import Transactions from "@/pages/Transactions";
import Fees from "@/pages/Fees";
import Discounts from "@/pages/Discounts";
import Feedback from "@/pages/Feedback";
import CalendarView from "@/pages/CalendarView";
import NotFound from "@/pages/not-found";

function ProtectedRoute({
  component: Component,
}: {
  component: React.ComponentType;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>

      <Route path="/books">
        {() => <ProtectedRoute component={Books} />}
      </Route>

      <Route path="/transactions">
        {() => <ProtectedRoute component={Transactions} />}
      </Route>

      <Route path="/calendar">
        {() => <ProtectedRoute component={CalendarView} />}
      </Route>

      <Route path="/fees">
        {() => <ProtectedRoute component={Fees} />}
      </Route>

      <Route path="/discounts">
        {() => <ProtectedRoute component={Discounts} />}
      </Route>

      <Route path="/feedback">
        {() => <ProtectedRoute component={Feedback} />}
      </Route>

      {/* Default redirect */}
      <Route path="/">
        {() => <Redirect to="/dashboard" />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
