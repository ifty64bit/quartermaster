import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Box, DollarSign } from "lucide-react";
import { formatCompactCurrency } from "@/features/assets/utils";
import { getDashboardOptions } from "@/features/dashboard/apis";
import { CategoryValueChart } from "@/features/dashboard/components/category-value-chart";
import { ConditionBreakdown } from "@/features/dashboard/components/condition-breakdown";
import { MostValuableAssets } from "@/features/dashboard/components/most-valuable-assets";
import { RecentActivityFeed } from "@/features/dashboard/components/recent-activity-feed";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { WarrantyExpiryList } from "@/features/dashboard/components/warranty-expiry-list";

export const Route = createFileRoute("/_authenticated/dashboard")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getDashboardOptions());
	},
	pendingComponent: DashboardSkeleton,
	component: DashboardPage,
});

function DashboardPage() {
	const { data } = useSuspenseQuery(getDashboardOptions());

	const warrantyDescription =
		data.warrantyUrgent > 0
			? `${data.warrantyUrgent} expired or ≤30 days`
			: data.warrantySoon > 0
				? `${data.warrantySoon} expiring within 90 days`
				: "All warranties healthy";

	return (
		<div className="flex flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Overview of your asset portfolio
				</p>
			</header>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					title="Total Assets"
					value={data.totalAssets.toString()}
					description={`${data.categoryCount} ${data.categoryCount === 1 ? "category" : "categories"}`}
					icon={<Box className="size-5" />}
				/>
				<StatCard
					title="Portfolio Value"
					value={formatCompactCurrency(
						data.portfolioTotal,
						data.primaryCurrency,
					)}
					description={
						data.mixedCurrencies
							? `${data.currencyCount} currencies`
							: undefined
					}
					icon={<DollarSign className="size-5" />}
				/>
				<StatCard
					title="Warranty Alerts"
					value={data.warrantySoon.toString()}
					description={warrantyDescription}
					icon={<AlertTriangle className="size-5" />}
					iconClassName={
						data.warrantyUrgent > 0
							? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
							: undefined
					}
				/>
			</div>

			{data.totalAssets > 0 && (
				<ConditionBreakdown
					counts={data.conditionCounts}
					total={data.totalAssets}
				/>
			)}

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<CategoryValueChart data={data.categoryData} />
				<WarrantyExpiryList items={data.warrantyItems} />
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<MostValuableAssets assets={data.topAssets} />
				<RecentActivityFeed items={data.activityFeed} />
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-sm text-muted-foreground">Loading your portfolio…</p>
			</header>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{["skel-1", "skel-2", "skel-3"].map((key) => (
					<div
						key={key}
						className="h-36 animate-pulse rounded-xl border bg-muted/40"
					/>
				))}
			</div>
			<div className="h-3 w-full animate-pulse rounded-full bg-muted/40" />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{["skel-chart", "skel-warranty", "skel-top", "skel-activity"].map(
					(key) => (
						<div
							key={key}
							className="h-80 animate-pulse rounded-xl border bg-muted/40"
						/>
					),
				)}
			</div>
		</div>
	);
}
