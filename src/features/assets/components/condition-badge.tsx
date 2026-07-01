import type { Asset } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const CONDITION_VARIANTS = {
	new: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
	used: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
	refurbished: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export const CONDITION_LABELS = {
	new: "New",
	used: "Used",
	refurbished: "Refurbished",
};

export function ConditionBadge({
	condition,
}: {
	condition: Asset["condition"];
}) {
	const variant =
		CONDITION_VARIANTS[condition as keyof typeof CONDITION_VARIANTS];

	return (
		<span
			className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", variant)}
		>
			{CONDITION_LABELS[condition as keyof typeof CONDITION_LABELS]}
		</span>
	);
}
