import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string;
	description?: string;
	icon: ReactNode;
	iconClassName?: string;
}

export function StatCard({
	title,
	value,
	description,
	icon,
	iconClassName,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						{title}
					</CardTitle>
					<div
						className={cn(
							"flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground",
							iconClassName,
						)}
					>
						{icon}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-bold tabular-nums">{value}</p>
				{description && (
					<p className="mt-1 text-xs text-muted-foreground">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}
