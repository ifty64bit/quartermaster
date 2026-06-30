import { cn } from "@/lib/utils";

interface ConditionBreakdownProps {
	counts: Record<string, number>;
	total: number;
}

const CONDITIONS = [
	{
		key: "new",
		label: "New",
		dotClassName: "bg-emerald-500",
		barClassName: "bg-emerald-500",
	},
	{
		key: "used",
		label: "Used",
		dotClassName: "bg-blue-500",
		barClassName: "bg-blue-500",
	},
	{
		key: "refurbished",
		label: "Refurbished",
		dotClassName: "bg-amber-500",
		barClassName: "bg-amber-500",
	},
] as const;

export function ConditionBreakdown({ counts, total }: ConditionBreakdownProps) {
	if (total === 0) return null;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
				{CONDITIONS.map(({ key, barClassName }) => {
					const count = counts[key] || 0;
					if (count === 0) return null;
					const pct = (count / total) * 100;
					return (
						<div
							key={key}
							className={cn("transition-all duration-500", barClassName)}
							style={{ width: `${pct}%` }}
						/>
					);
				})}
			</div>
			<div className="flex flex-wrap gap-x-4 gap-y-1">
				{CONDITIONS.map(({ key, label, dotClassName }) => {
					const count = counts[key] || 0;
					if (count === 0) return null;
					return (
						<div key={key} className="flex items-center gap-1.5 text-xs">
							<span
								className={cn("size-2 shrink-0 rounded-full", dotClassName)}
							/>
							<span className="text-muted-foreground">{label}</span>
							<span className="font-medium tabular-nums">{count}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
