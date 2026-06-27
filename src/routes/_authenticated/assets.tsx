import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Box, Plus, Search, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAssetsOptions } from "@/features/assets/apis";
import { AssetEditDialog } from "@/features/assets/components/asset-edit-dialog";
import { QuickAddDialog } from "@/features/assets/components/quick-add-dialog";
import type { Asset } from "@/features/assets/types";
import { completeness, formatCurrency } from "@/features/assets/utils";
import { cn, formatDate } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assets")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getAssetsOptions());
	},
	pendingComponent: () => <AssetGridSkeleton />,
	component: AssetsPage,
});

function AssetsPage() {
	const { data: assets } = useSuspenseQuery(getAssetsOptions());
	const [query, setQuery] = useState("");

	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
					<p className="text-sm text-muted-foreground">
						{assets.length} {assets.length === 1 ? "asset" : "assets"}
						{" · "}
						{assets.filter((a) => completeness(a) < 100).length} need details
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Dialog>
						<DialogTrigger>
							<Button variant="default">
								<Zap />
								Quick add
							</Button>
						</DialogTrigger>
						<QuickAddDialog />
					</Dialog>
					<Button variant="outline">
						<Plus />
						Add details
					</Button>
				</div>
			</header>

			<div className="relative">
				<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search by name, model, serial, brand…"
					className="pl-9"
				/>
			</div>

			{assets.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{assets.map((asset) => (
						<AssetCard key={asset.id} asset={asset} />
					))}
				</div>
			) : assets.length === 0 ? (
				<EmptyState />
			) : (
				<p className="py-12 text-center text-sm text-muted-foreground">
					No assets match "{query}".
				</p>
			)}
		</div>
	);
}

function AssetCard({ asset }: { asset: Asset }) {
	const pct = completeness(asset);
	return (
		<div className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
						<Box className="size-5" />
					</div>
					<div className="min-w-0">
						<h3 className="truncate font-semibold">{asset.name}</h3>
						<p className="truncate text-sm text-muted-foreground">
							{[asset.brand?.name, asset.model].filter(Boolean).join(" · ") ||
								"No details yet"}
						</p>
					</div>
				</div>
				<AssetEditDialog asset={asset} />
			</div>

			<div className="flex items-center gap-2">
				{asset.category && (
					<span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
						{asset.category.name}
					</span>
				)}
				<CompletenessTag pct={pct} />
			</div>

			<div className="flex items-end justify-between">
				<div>
					<p className="font-medium tabular-nums">
						{formatCurrency(asset.purchasePrice, asset.currency)}
					</p>
					<p className="text-xs text-muted-foreground">
						Bought {formatDate(asset.purchaseDate)}
					</p>
				</div>
			</div>

			<div className="h-1 w-full overflow-hidden rounded-full bg-muted">
				<div
					className={cn(
						"h-full rounded-full transition-all",
						pct === 100
							? "bg-emerald-500"
							: pct >= 50
								? "bg-amber-500"
								: "bg-primary",
					)}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function CompletenessTag({ pct }: { pct: number }) {
	if (pct === 100) {
		return (
			<span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
				Complete
			</span>
		);
	}
	return (
		<span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
			{pct}% filled
		</span>
	);
}

const SKELETON_KEYS = [
	"skel-1",
	"skel-2",
	"skel-3",
	"skel-4",
	"skel-5",
	"skel-6",
];

function AssetGridSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
					<p className="text-sm text-muted-foreground">Loading assets…</p>
				</div>
				<div className="flex items-center gap-2">
					<Button disabled>
						<Zap />
						Quick add
					</Button>
					<Button variant="outline" disabled>
						<Plus />
						Add details
					</Button>
				</div>
			</header>

			<div className="relative">
				<div className="h-10 animate-pulse rounded-lg bg-muted/40" />
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{SKELETON_KEYS.map((key) => (
					<div
						key={key}
						className="h-48 animate-pulse rounded-xl border bg-muted/40"
					/>
				))}
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-muted">
				<Box className="size-6 text-muted-foreground" />
			</div>
			<h3 className="mt-4 text-lg font-semibold">No assets yet</h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">
				Quick add your first asset in seconds — just a name and a price. You can
				fill in the details later.
			</p>
			<Dialog>
				<DialogTrigger>
					<Button className="mt-6">
						<Zap />
						Quick add asset
					</Button>
				</DialogTrigger>
				<QuickAddDialog />
			</Dialog>
		</div>
	);
}
