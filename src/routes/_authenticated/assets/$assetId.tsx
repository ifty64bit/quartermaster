import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
	ArrowLeft,
	Box,
	CircleDollarSign,
	Clock,
	ExternalLink,
	FileText,
	ShieldCheck,
	ShoppingBag,
	Tag,
} from "lucide-react";
import { getAssetOptions } from "@/features/assets/apis";
import AssetDeleteDialog from "@/features/assets/components/asset-delete-dialog";
import { AssetEditDialog } from "@/features/assets/components/asset-edit-dialog";
import BrandIcon from "@/features/assets/components/brand-icon";
import { CategoryBadge } from "@/features/assets/components/category-badge";
import { CompletenessBadge } from "@/features/assets/components/completeness-badge";
import {
	CONDITION_LABELS,
	ConditionBadge,
} from "@/features/assets/components/condition-badge";
import DetailSection from "@/features/assets/components/detail-section";
import FieldRow from "@/features/assets/components/field-row";
import { WarrantyPill } from "@/features/assets/components/warranty-pill";
import { completeness, formatCurrency } from "@/features/assets/utils";
import { getBrandIconUrl } from "@/features/brands/utils";
import { getCategoryIconUrl } from "@/features/categories/utils";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assets/$assetId")({
	loader: async ({ context, params }) => {
		await context.queryClient.ensureQueryData(
			getAssetOptions(Number(params.assetId)),
		);
	},
	pendingComponent: AssetDetailSkeleton,
	component: AssetDetailPage,
});

function AssetDetailPage() {
	const { assetId } = Route.useParams();
	const { data: asset } = useSuspenseQuery(getAssetOptions(Number(assetId)));
	const pct = completeness(asset);
	const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);

	return (
		<main className="flex flex-col gap-6">
			<nav>
				<Link
					to="/assets"
					className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
				>
					<ArrowLeft className="size-4" />
					Back to Assets
				</Link>
			</nav>

			{/* Hero card */}
			<header className="flex flex-col gap-6 rounded-xl border bg-card p-6 sm:p-8">
				<section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<section className="flex items-center gap-4">
						<BrandIcon asset={asset} />
						<section className="flex min-w-0 flex-col gap-1.5">
							<h1 className="truncate text-2xl font-bold tracking-tight">
								{asset.name}
							</h1>
							<p className="truncate text-sm text-muted-foreground">
								{[asset.brand?.name, asset.model].filter(Boolean).join(" · ") ||
									"No model specified"}
							</p>
						</section>
					</section>
					<section className="flex items-center gap-2">
						<AssetEditDialog asset={asset} />
						<AssetDeleteDialog asset={asset} />
					</section>
				</section>

				<section className="flex flex-wrap items-center gap-2">
					{asset.category && (
						<CategoryBadge
							name={asset.category.name}
							icon={asset.category.icon}
						/>
					)}
					<ConditionBadge condition={asset.condition} />
					<CompletenessBadge pct={pct} />
					{warrantyStatus && <WarrantyPill status={warrantyStatus} />}
				</section>

				<section className="border-t pt-6">
					<div className="flex items-center gap-2">
						<CircleDollarSign className="size-6 text-muted-foreground" />
						<span className="text-3xl font-bold tabular-nums tracking-tight">
							{formatCurrency(asset.purchasePrice, asset.currency)}
						</span>
					</div>
					<span className="text-sm text-muted-foreground">
						Purchased {formatDate(asset.purchaseDate)}
					</span>
				</section>
			</header>

			{/* Detail grid */}
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<DetailSection icon={ShoppingBag} heading="Purchase">
					<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
						<FieldRow
							label="Price"
							value={formatCurrency(asset.purchasePrice, asset.currency)}
							strong
						/>
						<FieldRow label="Date" value={formatDate(asset.purchaseDate)} />
						<FieldRow
							label="Store"
							value={asset.store}
							fallback="Not specified"
						/>
						<FieldRow
							label="Product URL"
							value={
								asset.productUrl ? (
									<a
										href={
											asset.productUrl.startsWith("http")
												? asset.productUrl
												: `https://${asset.productUrl}`
										}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
									>
										View product
										<ExternalLink className="size-3 shrink-0" />
									</a>
								) : undefined
							}
							fallback="Not specified"
						/>
					</dl>
				</DetailSection>

				<DetailSection icon={Tag} heading="Specifications">
					<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
						<FieldRow label="Model" value={asset.model} fallback="—" />
						<FieldRow label="Serial" value={asset.serial} fallback="—" />
						<FieldRow
							label="Brand"
							value={
								asset.brand ? (
									<span className="inline-flex items-center gap-1.5">
										{getBrandIconUrl(asset.brand.domain) ? (
											<img
												src={getBrandIconUrl(asset.brand.domain) as string}
												alt={asset.brand.name}
												className="size-4 shrink-0 rounded-sm object-contain"
												loading="lazy"
											/>
										) : (
											<Box className="size-3" />
										)}
										{asset.brand.name}
									</span>
								) : undefined
							}
							fallback="—"
						/>
						<FieldRow
							label="Category"
							value={
								asset.category ? (
									<span className="inline-flex items-center gap-1.5">
										{getCategoryIconUrl(asset.category.icon) ? (
											<img
												src={getCategoryIconUrl(asset.category.icon) as string}
												alt={asset.category.name}
												className="size-4"
											/>
										) : (
											<Box className="size-4 text-muted-foreground" />
										)}
										{asset.category.name}
									</span>
								) : undefined
							}
							fallback="—"
						/>
					</dl>
				</DetailSection>

				<DetailSection icon={ShieldCheck} heading="Warranty & Condition">
					<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
						<FieldRow
							label="Condition"
							value={
								CONDITION_LABELS[
									asset.condition as keyof typeof CONDITION_LABELS
								]
							}
							strong
						/>
						<FieldRow
							label="Warranty expires"
							value={
								asset.warrantyExpiry
									? formatDate(asset.warrantyExpiry)
									: undefined
							}
							fallback="No warranty"
						/>
						<FieldRow
							label="Age"
							value={
								new Date() > new Date(asset.purchaseDate)
									? age(asset.purchaseDate)
									: undefined
							}
							fallback="—"
						/>
						<FieldRow label="Profile completeness" value={`${pct}%`} />
					</dl>
				</DetailSection>

				<DetailSection icon={Clock} heading="Metadata">
					<dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
						<FieldRow
							label="Added to inventory"
							value={formatDate(asset.createdAt)}
						/>
						<FieldRow
							label="Last updated"
							value={formatDate(asset.updatedAt)}
						/>
						<FieldRow label="Asset ID" value={`#${asset.id}`} />
					</dl>
				</DetailSection>
			</section>

			{/* Notes — full width */}
			{asset.notes && (
				<aside className="rounded-xl border bg-card p-6">
					<h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						<FileText className="size-4" />
						Notes
					</h2>
					<p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
						{asset.notes}
					</p>
				</aside>
			)}
		</main>
	);
}

function AssetDetailSkeleton() {
	return (
		<main className="flex flex-col gap-6">
			<nav>
				<span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
					<ArrowLeft className="size-4" />
					Back to Assets
				</span>
			</nav>
			<header className="flex flex-col gap-6 rounded-xl border bg-card p-8">
				<section className="flex items-center gap-4">
					<span className="size-10 shrink-0 animate-pulse rounded-lg bg-muted" />
					<section className="flex flex-col gap-2">
						<span className="h-7 w-56 animate-pulse rounded-md bg-muted" />
						<span className="h-4 w-32 animate-pulse rounded bg-muted" />
					</section>
				</section>
				<section className="flex flex-wrap gap-2">
					<span className="h-5 w-20 animate-pulse rounded-full bg-muted" />
					<span className="h-5 w-16 animate-pulse rounded-full bg-muted" />
					<span className="h-5 w-24 animate-pulse rounded-full bg-muted" />
				</section>
				<section className="flex items-baseline gap-2 border-t pt-6">
					<span className="h-8 w-40 animate-pulse rounded-md bg-muted" />
				</section>
			</header>
			<section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{[1, 2, 3, 4].map((i) => (
					<section
						key={i}
						className="animate-pulse rounded-xl border bg-card p-6"
					>
						<span className="mb-4 block h-4 w-24 rounded bg-muted" />
						<span className="block space-y-3">
							<span className="flex items-baseline justify-between gap-4">
								<span className="h-3 w-20 rounded bg-muted" />
								<span className="h-4 w-28 rounded bg-muted" />
							</span>
							<span className="flex items-baseline justify-between gap-4">
								<span className="h-3 w-16 rounded bg-muted" />
								<span className="h-4 w-20 rounded bg-muted" />
							</span>
							<span className="flex items-baseline justify-between gap-4">
								<span className="h-3 w-24 rounded bg-muted" />
								<span className="h-4 w-16 rounded bg-muted" />
							</span>
						</span>
					</section>
				))}
			</section>
		</main>
	);
}

function getWarrantyStatus(
	warrantyExpiry: string | Date | null | undefined,
): { label: string; active: boolean } | null {
	if (!warrantyExpiry) return null;
	const expiry = new Date(warrantyExpiry);
	const now = new Date();
	const active = expiry > now;
	const daysLeft = Math.ceil(
		(expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (active) {
		if (daysLeft <= 30) return { label: `Warranty in ${daysLeft}d`, active };
		return { label: "Under warranty", active };
	}
	return { label: "Warranty expired", active: false };
}

function age(date: string | Date): string {
	const months = dayjs().diff(dayjs(date), "month");

	if (months < 1) return "Less than a month";
	if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;

	const y = Math.floor(months / 12);
	const m = months % 12;
	if (m === 0) return `${y} ${y === 1 ? "year" : "years"}`;
	return `${y} ${y === 1 ? "year" : "years"}, ${m} ${m === 1 ? "month" : "months"}`;
}
