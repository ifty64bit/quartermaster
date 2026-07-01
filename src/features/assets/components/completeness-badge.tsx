import { cn } from "@/lib/utils";

export function CompletenessBadge({ pct }: { pct: number }) {
	const color =
		pct === 100
			? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
			: pct >= 50
				? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
				: "bg-muted text-muted-foreground";

	return (
		<span
			className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", color)}
		>
			{pct === 100 ? "Complete" : `${pct}% filled`}
		</span>
	);
}
