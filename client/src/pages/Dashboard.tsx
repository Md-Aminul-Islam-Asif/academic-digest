import { Shell } from "@/components/layout/shell";
import { useStats } from "../hooks/use-misc";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, CheckCircle, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  return (
    <Shell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of library statistics and activity.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Books" 
            value={stats?.totalBooks} 
            loading={isLoading} 
            icon={Book}
            description="Books in catalog"
            className="border-l-4 border-l-primary"
          />
          <StatsCard 
            title="Issued Books" 
            value={stats?.issuedBooks} 
            loading={isLoading} 
            icon={BookOpen}
            description="Currently checked out"
            className="border-l-4 border-l-amber-500"
          />
          <StatsCard 
            title="Available" 
            value={stats?.availableBooks} 
            loading={isLoading} 
            icon={CheckCircle}
            description="Ready for pickup"
            className="border-l-4 border-l-green-500"
          />
          <StatsCard 
            title="Total Students" 
            value={stats?.totalStudents} 
            loading={isLoading} 
            icon={Users}
            description="Registered users"
            className="border-l-4 border-l-purple-500"
          />
        </div>

        {/* Placeholder for recent activity or chart */}
        <div className="grid gap-8 md:grid-cols-2">
           <Card className="hover-card">
             <CardHeader>
               <CardTitle className="text-lg">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Common tasks you might want to perform.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <span className="block font-semibold">Issue Book</span>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                     <span className="block font-semibold">Add Book</span>
                  </div>
                   <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                     <span className="block font-semibold">Return Book</span>
                  </div>
                   <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                     <span className="block font-semibold">Calculate Fee</span>
                  </div>
                </div>
             </CardContent>
           </Card>

           <Card className="hover-card">
             <CardHeader>
               <CardTitle className="text-lg">System Status</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <span className="text-sm">Database Connection</span>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Healthy</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm">API Status</span>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Online</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-sm">Last Backup</span>
                   <span className="text-xs text-muted-foreground">Today, 04:00 AM</span>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </Shell>
  );
}

function StatsCard({ 
  title, 
  value, 
  loading, 
  icon: Icon, 
  description,
  className 
}: { 
  title: string; 
  value?: number; 
  loading: boolean; 
  icon: any;
  description: string;
  className?: string;
}) {
  return (
    <Card className={`hover-card ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-1" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
