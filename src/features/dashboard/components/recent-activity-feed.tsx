import {
	Activity,
	Archive,
	Gift,
	type LucideIcon,
	Package,
	Pencil,
	ShoppingCart,
	Trash2,
	Undo2,
	Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
	id: number;
	assetId: number;
	assetName: string;
	action: string;
	notes: string | null;
	createdAt: string;
}

interface RecentActivityFeedProps {
	items: ActivityItem[];
}

const ACTION_CONFIG: Record<
	string,
	{ icon: LucideIcon; label: string; className: string }
> = {
	created: {
		icon: Package,
		label: "Added",
		className:
			"bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
	},
	updated: {
		icon: Pencil,
		label: "Updated",
		className:
			"bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
	},
	repaired: {
		icon: Wrench,
		label: "Repaired",
		className:
			"bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
	},
	sold: {
		icon: ShoppingCart,
		label: "Sold",
		className:
			"bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
	},
	donated: {
		icon: Gift,
		label: "Donated",
		className:
			"bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
	},
	destroyed: {
		icon: Trash2,
		label: "Destroyed",
		className:
			"bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400",
	},
	deleted: {
		icon: Trash2,
		label: "Deleted",
		className:
			"bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400",
	},
	archived: {
		icon: Archive,
		label: "Archived",
		className:
			"bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400",
	},
	restored: {
		icon: Undo2,
		label: "Restored",
		className:
			"bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400",
	},
};

const FALLBACK_CONFIG = {
	icon: Activity,
	label: "Action",
	className: "bg-muted text-muted-foreground",
};

function formatRelativeTime(isoDate: string): string {
	const diff = Date.now() - new Date(isoDate).getTime();
	const minutes = Math.floor(diff / 60_000);
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	const weeks = Math.floor(days / 7);
	if (weeks < 4) return `${weeks}w ago`;
	return new Date(isoDate).toLocaleDateString();
}

export function RecentActivityFeed({ items }: RecentActivityFeedProps) {
	if (items.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="size-4.5 text-muted-foreground" />
						Recent Activity
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="py-6 text-center text-sm text-muted-foreground">
						No activity yet
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Activity className="size-4.5 text-muted-foreground" />
					Recent Activity
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-1">
				{items.map((item) => {
					const config = ACTION_CONFIG[item.action] || FALLBACK_CONFIG;
					const Icon = config.icon;

					return (
						<div
							key={item.id}
							className="flex items-center gap-3 rounded-lg px-3 py-2.5"
						>
							<div
								className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${config.className}`}
							>
								<Icon className="size-4" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-sm">
									<span className="font-medium">{config.label}</span>{" "}
									<span className="text-muted-foreground">
										{item.assetName}
									</span>
								</p>
								{item.notes && (
									<p className="truncate text-xs text-muted-foreground">
										{item.notes}
									</p>
								)}
							</div>
							<span className="shrink-0 text-xs tabular-nums text-muted-foreground">
								{formatRelativeTime(item.createdAt)}
							</span>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
