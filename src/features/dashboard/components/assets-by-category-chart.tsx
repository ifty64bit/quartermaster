import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCount {
	name: string;
	count: number;
}

interface AssetsByCategoryChartProps {
	data: CategoryCount[];
}

export function AssetsByCategoryChart({ data }: AssetsByCategoryChartProps) {
	if (data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Assets by Category</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="py-8 text-center text-sm text-muted-foreground">
						No categorized assets yet
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Assets by Category</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-52">
					<BarChart data={data} width={500} height={208} responsive>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis
							dataKey="name"
							tick={{ fontSize: 12 }}
							tickLine={false}
							axisLine={false}
							interval={0}
							angle={-35}
							textAnchor="end"
							height={60}
						/>
						<YAxis
							allowDecimals={false}
							tick={{ fontSize: 12 }}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip />
						<Bar
							dataKey="count"
							fill="var(--color-chart-1)"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</div>
			</CardContent>
		</Card>
	);
}
