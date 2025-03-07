import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, getWeek, getYear, subWeeks } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Users, Clock, MousePointerClick, ArrowUp, ArrowDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week");
  const [compareMode, setCompareMode] = useState(false);

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  };

  const { data: currentMetrics, isLoading } = useQuery({
    queryKey: ["/api/analytics/metrics", dateRange],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
      const response = await fetch(`/api/analytics/metrics?${params}`);
      return response.json();
    },
  });

  const { data: previousMetrics } = useQuery({
    queryKey: ["/api/analytics/metrics", dateRange, "previous"],
    enabled: compareMode,
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      const previousStartDate = subWeeks(startDate, 1);
      const previousEndDate = subWeeks(endDate, 1);
      const params = new URLSearchParams({
        start: previousStartDate.toISOString(),
        end: previousEndDate.toISOString(),
      });
      const response = await fetch(`/api/analytics/metrics?${params}`);
      return response.json();
    },
  });

  const getPercentageChange = (current: number, previous: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 w-1/2 bg-muted rounded" />
              <div className="h-8 w-3/4 bg-muted rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Select
            value={dateRange}
            onValueChange={(value: "week" | "month" | "year") => setDateRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => setCompareMode(!compareMode)}
          >
            {compareMode ? "Hide Comparison" : "Compare with Previous"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Visitors</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {currentMetrics?.totalVisitors}
              {compareMode && previousMetrics && (
                <span className={`text-sm ${
                  getPercentageChange(currentMetrics.totalVisitors, previousMetrics.totalVisitors) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                  {getPercentageChange(currentMetrics.totalVisitors, previousMetrics.totalVisitors)}%
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avg. Session Duration</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {Math.round(currentMetrics?.averageSessionDuration / 1000 / 60)} mins
              {compareMode && previousMetrics && (
                <span className={`text-sm ${
                  getPercentageChange(
                    currentMetrics.averageSessionDuration,
                    previousMetrics.averageSessionDuration
                  ) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                  {getPercentageChange(
                    currentMetrics.averageSessionDuration,
                    previousMetrics.averageSessionDuration
                  )}%
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Popular Pages</CardDescription>
            <CardContent className="pt-6">
              {currentMetrics?.popularPages.map((page, i) => (
                <div key={i} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground truncate">
                    {page.path}
                  </span>
                  <span className="text-sm font-medium">{page.views}</span>
                </div>
              ))}
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentMetrics?.visitTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), "PPP")}
                />
                <Legend />
                <Line 
                  name="Current Period"
                  type="monotone" 
                  dataKey="visits" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
                {compareMode && previousMetrics && (
                  <Line
                    name="Previous Period"
                    type="monotone"
                    dataKey="previousVisits"
                    stroke="hsl(var(--muted))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}