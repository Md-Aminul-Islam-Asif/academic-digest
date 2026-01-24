import { Shell } from "@/components/layout/shell";
import { useStats } from "../hooks/use-misc";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";

import { Book, Users, CheckCircle, BookOpen } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useStats();

  return (
    <Shell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of library statistics and activity.
          </p>
        </div>

        {/* Stats */}
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

        {/* Panels */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Common tasks you might want to perform.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Issue Book",
                  "Add Book",
                  "Return Book",
                  "Calculate Fee",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-4 bg-muted/30 rounded-lg border text-center hover:bg-muted/50 transition cursor-pointer"
                  >
                    <span className="font-semibold">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusRow label="Database Connection" value="Healthy" />
              <StatusRow label="API Status" value="Online" />
              <StatusRow label="Last Backup" value="Today, 04:00 AM" muted />
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

/* =========================
   Helpers
   ========================= */

function StatusRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          muted
            ? "text-muted-foreground"
            : "bg-green-100 text-green-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatsCard({
  title,
  value,
  loading,
  icon: Icon,
  description,
  className,
}: {
  title: string;
  value?: number;
  loading: boolean;
  icon: any;
  description: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16 mb-1" />
        ) : (
          <div className="text-2xl font-bold">
            {value}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
