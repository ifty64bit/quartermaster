import { cn } from "@/lib/utils";

export function WarrantyPill({
	status,
}: {
	status: { label: string; active: boolean };
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
				status.active
					? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
					: "bg-red-500/15 text-red-600 dark:text-red-400",
			)}
		>
			<span
				className={cn(
					"size-1.5 rounded-full",
					status.active ? "bg-emerald-500" : "bg-red-500",
				)}
			/>
			{status.label}
		</span>
	);
}
