import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Progress,
	ProgressIndicator,
	ProgressTrack,
} from "@/components/ui/progress";
import { getAssetsOptions } from "@/features/assets/apis";
import AssetDeleteDialog from "@/features/assets/components/asset-delete-dialog";
import { AssetEditDialog } from "@/features/assets/components/asset-edit-dialog";
import AssetGridSkeleton from "@/features/assets/components/asset-grid-skeleton";
import BrandIcon from "@/features/assets/components/brand-icon";
import CompletenessTag from "@/features/assets/components/completeness-tag";
import EmptyState from "@/features/assets/components/empty-state";
import { QuickAddDialog } from "@/features/assets/components/quick-add-dialog";
import type { Asset } from "@/features/assets/types";
import { completeness, formatCurrency } from "@/features/assets/utils";
import { getCategoryIconUrl } from "@/features/categories/utils";
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
					<BrandIcon asset={asset} />
					<div className="min-w-0">
						<h3 className="truncate font-semibold">{asset.name}</h3>
						<p className="truncate text-sm text-muted-foreground">
							{[asset.brand?.name, asset.model].filter(Boolean).join(" · ") ||
								"No details yet"}
						</p>
					</div>
				</div>
				<div>
					<AssetEditDialog asset={asset} />
					<AssetDeleteDialog asset={asset} />
				</div>
			</div>

			<div className="flex items-center gap-2">
				{asset.category && (
					<CategoryBadge
						name={asset.category.name}
						icon={asset.category.icon}
					/>
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

			<Progress value={pct} className="w-full">
				<ProgressTrack className="h-1 bg-muted">
					<ProgressIndicator
						className={cn(
							pct === 100
								? "bg-emerald-500"
								: pct >= 50
									? "bg-amber-500"
									: "bg-primary",
						)}
					/>
				</ProgressTrack>
			</Progress>
		</div>
	);
}

function CategoryBadge({ name, icon }: { name: string; icon?: string | null }) {
	const iconUrl = getCategoryIconUrl(icon);
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
			{iconUrl && (
				<img src={iconUrl} alt="" className="size-4 shrink-0" loading="lazy" />
			)}
			{name}
		</span>
	);
}
