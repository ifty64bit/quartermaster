import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, ShieldCheck, ShieldX } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WarrantyItem {
	id: number;
	name: string;
	category: string;
	expiryDate: string;
	daysRemaining: number;
	status: "expired" | "urgent" | "warning" | "ok";
}

interface WarrantyExpiryListProps {
	items: WarrantyItem[];
}

const STATUS_CONFIG = {
	expired: {
		label: "Expired",
		className:
			"bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400",
		icon: ShieldX,
	},
	urgent: {
		label: "≤30 days",
		className:
			"bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
		icon: AlertTriangle,
	},
	warning: {
		label: "≤90 days",
		className:
			"bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
		icon: AlertTriangle,
	},
	ok: {
		label: "Active",
		className:
			"bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
		icon: ShieldCheck,
	},
} as const;

function formatDaysRemaining(days: number): string {
	if (days < 0) return `${Math.abs(days)}d overdue`;
	if (days === 0) return "Today";
	if (days === 1) return "Tomorrow";
	return `${days}d left`;
}

export function WarrantyExpiryList({ items }: WarrantyExpiryListProps) {
	if (items.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400" />
						Warranty Status
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center gap-2 py-6 text-center">
						<ShieldCheck className="size-10 text-emerald-500/40" />
						<p className="text-sm text-muted-foreground">
							All warranties are healthy
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const displayed = items.slice(0, 5);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<AlertTriangle className="size-4.5 text-amber-600 dark:text-amber-400" />
					Warranty Status
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-1">
				{displayed.map((item) => {
					const config = STATUS_CONFIG[item.status];
					const Icon = config.icon;

					return (
						<Link
							key={item.id}
							to="/assets"
							className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
						>
							<div
								className={cn(
									"flex size-8 shrink-0 items-center justify-center rounded-lg",
									config.className,
								)}
							>
								<Icon className="size-4" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium">{item.name}</p>
								<p className="text-xs text-muted-foreground">{item.category}</p>
							</div>
							<div className="shrink-0 text-right">
								<span
									className={cn(
										"inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
										config.className,
									)}
								>
									{formatDaysRemaining(item.daysRemaining)}
								</span>
							</div>
						</Link>
					);
				})}
			</CardContent>
			{items.length > 5 && (
				<CardFooter>
					<Link
						to="/assets"
						className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						View all {items.length} items
						<ArrowRight className="size-3.5" />
					</Link>
				</CardFooter>
			)}
		</Card>
	);
}
