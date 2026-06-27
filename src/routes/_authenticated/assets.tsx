import { createFileRoute } from "@tanstack/react-router";
import { Box, Pencil, Plus, Search, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssetEditDialog } from "@/features/assets/components/asset-edit-dialog";
import { QuickAddDialog } from "@/features/assets/components/quick-add-dialog";
import {
	mockAssets,
	mockBrands,
	mockCategories,
} from "@/features/assets/mock-data";
import type { Asset, QuickAddAsset } from "@/features/assets/types";
import {
	completeness,
	formatCurrency,
	formatDate,
} from "@/features/assets/utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assets")({
	component: AssetsPage,
});

function AssetsPage() {
	const [assets, setAssets] = useState<Asset[]>(mockAssets);
	const [quickAddOpen, setQuickAddOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<Asset | null>(null);
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		if (!query.trim()) return assets;
		const q = query.toLowerCase();
		return assets.filter(
			(a) =>
				a.name.toLowerCase().includes(q) ||
				a.model?.toLowerCase().includes(q) ||
				a.serial?.toLowerCase().includes(q) ||
				a.brand?.name.toLowerCase().includes(q) ||
				a.category?.name.toLowerCase().includes(q),
		);
	}, [assets, query]);

	function handleQuickAdd(data: QuickAddAsset) {
		const now = new Date().toISOString();
		const category =
			mockCategories.find((c) => c.id === data.categoryId) ?? null;
		const newAsset: Asset = {
			id: Math.max(0, ...assets.map((a) => a.id)) + 1,
			name: data.name,
			model: null,
			serial: null,
			purchaseDate: now.slice(0, 10),
			purchasePrice: data.purchasePrice,
			currency: "USD",
			store: null,
			productUrl: null,
			condition: "new",
			warrantyExpiry: null,
			notes: null,
			categoryId: data.categoryId,
			category,
			brandId: null,
			brand: null,
			createdAt: now,
			updatedAt: now,
		};
		setAssets((prev) => [newAsset, ...prev]);
	}

	function handleEditSubmit(
		data: Omit<Asset, "category" | "brand" | "createdAt" | "updatedAt">,
	) {
		const category =
			mockCategories.find((c) => c.id === data.categoryId) ?? null;
		const brand = mockBrands.find((b) => b.id === data.brandId) ?? null;
		setAssets((prev) =>
			prev.map((a) =>
				a.id === data.id
					? {
							...a,
							...data,
							category,
							brand,
							updatedAt: new Date().toISOString(),
						}
					: a,
			),
		);
		setEditTarget((prev) =>
			prev
				? {
						...prev,
						...data,
						category,
						brand,
						updatedAt: new Date().toISOString(),
					}
				: null,
		);
	}

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
					<Button variant="default" onClick={() => setQuickAddOpen(true)}>
						<Zap />
						Quick add
					</Button>
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

			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{filtered.map((asset) => (
						<AssetCard
							key={asset.id}
							asset={asset}
							onEdit={() => setEditTarget(asset)}
						/>
					))}
				</div>
			) : assets.length === 0 ? (
				<EmptyState onQuickAdd={() => setQuickAddOpen(true)} />
			) : (
				<p className="py-12 text-center text-sm text-muted-foreground">
					No assets match "{query}".
				</p>
			)}

			<QuickAddDialog
				open={quickAddOpen}
				onOpenChange={setQuickAddOpen}
				categories={mockCategories}
				onSubmit={handleQuickAdd}
			/>
			<AssetEditDialog
				key={editTarget?.id ?? "none"}
				open={!!editTarget}
				onOpenChange={(open) => !open && setEditTarget(null)}
				asset={editTarget}
				categories={mockCategories}
				brands={mockBrands}
				onSubmit={handleEditSubmit}
			/>
		</div>
	);
}

function AssetCard({ asset, onEdit }: { asset: Asset; onEdit: () => void }) {
	const pct = completeness(asset);
	const complete = pct === 100;
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
				<button
					type="button"
					aria-label={`Edit ${asset.name}`}
					onClick={onEdit}
					className={cn(
						buttonVariants({ variant: "ghost", size: "icon" }),
						"size-8 text-muted-foreground hover:text-foreground",
					)}
				>
					<Pencil className="size-4" />
				</button>
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
				<Button
					variant={complete ? "ghost" : "outline"}
					size="sm"
					onClick={onEdit}
				>
					<Plus className={cn(!complete && "size-3.5")} />
					{complete ? "View" : "Add details"}
				</Button>
			</div>

			<div className="h-1 w-full overflow-hidden rounded-full bg-muted">
				<div
					className={cn(
						"h-full rounded-full transition-all",
						complete
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

function EmptyState({ onQuickAdd }: { onQuickAdd: () => void }) {
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
			<Button onClick={onQuickAdd} className="mt-6">
				<Zap />
				Quick add asset
			</Button>
		</div>
	);
}
