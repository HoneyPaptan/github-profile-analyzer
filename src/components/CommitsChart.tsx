import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { fetchUserCommitsByYear, fetchUserCommits } from "../services/githubApi";

interface CommitData {
  date: string;
  count: number;
}

interface CommitsChartProps {
  username: string;
}

export const CommitsChart: React.FC<CommitsChartProps> = ({ username }) => {
  const currentYear = new Date().getFullYear();

  const [chartMode, setChartMode] = useState<"30days" | "yearly">("30days");
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const yearOptions = Array.from({ length: 6 }, (_, i) => (currentYear - 5 + i).toString());

  useEffect(() => {
    const fetchCommitsData = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const data =
          chartMode === "yearly"
            ? await fetchUserCommitsByYear(username, parseInt(selectedYear))
            : await fetchUserCommits(username);
        setCommits(data);
      } catch (error) {
        console.error("Error fetching commits:", error);
        setCommits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitsData();
  }, [chartMode, selectedYear, username]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const chartData = commits.map(item => ({
    date: formatDate(item.date),
    commits: item.count,
    fullDate: item.date,
  }));

  const chartConfig = {
    commits: {
      label: "Commits",
      color: "yellow",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Daily Commit Activity</CardTitle>
          <CardDescription>
            {loading
              ? "Loading..."
              : chartMode === "yearly"
              ? `Commit history for ${selectedYear}`
              : "Commit history for the last 30 days"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={chartMode}
            onValueChange={(value) => {
              if (value === "30days" || value === "yearly") {
                setChartMode(value);
              }
            }}
          >
            <ToggleGroupItem value="30days">30 Days</ToggleGroupItem>
            <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
          </ToggleGroup>

          {chartMode === "yearly" && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      <CardContent>
  <div className="w-full h-full relative">
    {loading ? (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading commit data...</p>
      </div>
    ) : commits.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">
          No commit data available {chartMode === "yearly" ? `for ${selectedYear}` : "for the last 30 days"}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Try selecting a different period or ensure that the user was active during this time.
        </p>
      </div>
    ) : (
      <ChartContainer config={chartConfig}>
        <LineChart
          width={359} 
          height={300}
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            domain={[0, (dataMax: number) => dataMax + 1]}
          />
          <ChartTooltip
            cursor={{ stroke: "yellow", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line dataKey="commits" type="monotoneX" stroke="yellow" strokeWidth={3} dot={{ fill: "yellow" }} activeDot={{ r: 6 }}>
            <LabelList
              dataKey="commits"
              position="top"
              offset={10}
              className="fill-foreground"
              formatter={(value: number) => (value === 0 ? "" : value.toString())}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    )}
  </div>
</CardContent>



    </Card>
  );
};
