import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Box, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/features/assets/utils";
import { getDashboardOptions } from "@/features/dashboard/apis";
import { AssetsByCategoryChart } from "@/features/dashboard/components/assets-by-category-chart";
import { CategoryValueChart } from "@/features/dashboard/components/category-value-chart";
import { StatCard } from "@/features/dashboard/components/stat-card";

export const Route = createFileRoute("/_authenticated/dashboard")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getDashboardOptions());
	},
	pendingComponent: DashboardSkeleton,
	component: DashboardPage,
});

function DashboardPage() {
	const { data: assets } = useSuspenseQuery(getDashboardOptions());

	const totalAssets = assets.length;

	const portfolioByCurrency = assets.reduce(
		(acc, a) => {
			acc[a.currency] = (acc[a.currency] || 0) + a.purchasePrice;
			return acc;
		},
		{} as Record<string, number>,
	);
	const primaryCurrency = Object.keys(portfolioByCurrency)[0] || "BDT";
	const portfolioTotal = portfolioByCurrency[primaryCurrency] || 0;
	const mixedCurrencies = Object.keys(portfolioByCurrency).length > 1;

	const categoryMap = new Map<
		string,
		{ name: string; value: number; count: number; currency: string }
	>();
	for (const asset of assets) {
		const key = asset.category?.name || "Uncategorized";
		const entry = categoryMap.get(key) || {
			name: key,
			value: 0,
			count: 0,
			currency: asset.currency,
		};
		entry.value += asset.purchasePrice;
		entry.count++;
		categoryMap.set(key, entry);
	}
	const categoryValueData = [...categoryMap.values()].sort(
		(a, b) => b.value - a.value,
	);
	const categoryCountData = [...categoryMap.values()]
		.map(({ name, count }) => ({ name, count }))
		.sort((a, b) => b.count - a.count);

	const now = new Date();
	const in30 = new Date(now.getTime() + 30 * 86_400_000);
	const in90 = new Date(now.getTime() + 90 * 86_400_000);
	let warrantySoon = 0;
	let warrantyUrgent = 0;
	for (const asset of assets) {
		if (!asset.warrantyExpiry) continue;
		const exp = new Date(asset.warrantyExpiry);
		if (exp <= now) warrantyUrgent++;
		else if (exp <= in30) warrantyUrgent++;
		if (exp > now && exp <= in90) warrantySoon++;
	}
	warrantySoon += warrantyUrgent;

	const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);
	const recentCount = assets.filter(
		(a) => new Date(a.createdAt) >= sevenDaysAgo,
	).length;

	const warrantyDescription =
		warrantyUrgent > 0
			? `${warrantyUrgent} expired or expiring within 30 days`
			: warrantySoon > 0
				? `${warrantySoon} expiring within 90 days`
				: "All warranties healthy";

	return (
		<div className="flex flex-col gap-6">
			<header>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Overview of your asset portfolio
				</p>
			</header>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Total Assets"
					value={totalAssets.toString()}
					description={`${categoryMap.size} ${categoryMap.size === 1 ? "category" : "categories"}`}
					icon={<Box className="size-5" />}
				/>
				<StatCard
					title="Portfolio Value"
					value={formatCurrency(portfolioTotal, primaryCurrency)}
					description={
						mixedCurrencies
							? `${Object.keys(portfolioByCurrency).length} currencies`
							: undefined
					}
					icon={<DollarSign className="size-5" />}
				/>
				<StatCard
					title="Warranty Alerts"
					value={warrantySoon.toString()}
					description={warrantyDescription}
					icon={<AlertTriangle className="size-5" />}
					iconClassName={
						warrantyUrgent > 0
							? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
							: undefined
					}
				/>
				<StatCard
					title="Recently Added"
					value={recentCount.toString()}
					description="Added in the last 7 days"
					icon={<Clock className="size-5" />}
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<CategoryValueChart data={categoryValueData} />
				<AssetsByCategoryChart data={categoryCountData} />
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
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{["skel-1", "skel-2", "skel-3", "skel-4"].map((key) => (
					<div
						key={key}
						className="h-36 animate-pulse rounded-xl border bg-muted/40"
					/>
				))}
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{["skel-chart-1", "skel-chart-2"].map((key) => (
					<div
						key={key}
						className="h-80 animate-pulse rounded-xl border bg-muted/40"
					/>
				))}
			</div>
		</div>
	);
}
