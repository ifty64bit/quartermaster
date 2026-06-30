import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency } from "@/features/assets/utils";

interface CategoryValue {
	name: string;
	value: number;
	count: number;
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
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Value by Category</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center gap-4 sm:flex-row">
					<div className="size-44 shrink-0 sm:size-48">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									innerRadius={45}
									outerRadius={72}
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
						</ResponsiveContainer>
					</div>
					<div className="flex min-w-0 flex-1 flex-col gap-1.5">
						{data.map((entry, index) => (
							<div key={entry.name} className="flex items-center gap-2 text-sm">
								<span
									className="size-2.5 shrink-0 rounded-full"
									style={{
										backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
									}}
								/>
								<span className="min-w-0 truncate text-muted-foreground">
									{entry.name}
								</span>
								<span className="ml-auto shrink-0 font-medium tabular-nums">
									{formatCompactCurrency(entry.value, entry.currency)}
								</span>
								<span className="shrink-0 text-[11px] tabular-nums text-muted-foreground/60">
									×{entry.count}
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
