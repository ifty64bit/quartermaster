import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/features/assets/utils";

interface CategoryValue {
	name: string;
	value: number;
	currency: string;
}

const CHART_COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)",
];

interface CategoryValueChartProps {
	data: CategoryValue[];
}

export function CategoryValueChart({ data }: CategoryValueChartProps) {
	if (data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Value by Category</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="py-8 text-center text-sm text-muted-foreground">
						No categorized assets yet
					</p>
				</CardContent>
			</Card>
		);
	}

	const currency = data[0].currency;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Value by Category</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center gap-4 sm:flex-row">
					<div className="h-52 w-52 shrink-0">
						<PieChart width={208} height={208}>
							<Pie
								data={data}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								innerRadius={50}
								outerRadius={80}
								strokeWidth={2}
							>
								{data.map((entry, index) => (
									<Cell
										key={entry.name}
										fill={CHART_COLORS[index % CHART_COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value) =>
									typeof value === "number"
										? formatCurrency(value, currency)
										: String(value)
								}
							/>
						</PieChart>
					</div>
					<div className="flex flex-col gap-2">
						{data.map((entry, index) => (
							<div key={entry.name} className="flex items-center gap-2 text-sm">
								<div
									className="size-3 shrink-0 rounded-sm"
									style={{
										backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
									}}
								/>
								<span className="text-muted-foreground">{entry.name}</span>
								<span className="ml-auto font-medium tabular-nums">
									{formatCurrency(entry.value, entry.currency)}
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
