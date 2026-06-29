import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getBrandsOptions } from "@/features/brands/apis";
import { BrandFormDialog } from "@/features/brands/components/brand-form-dialog";
import { DeleteBrandDialog } from "@/features/brands/components/delete-brand-dialog";
import { getBrandIconUrl } from "@/features/brands/utils";
import { cn } from "@/lib/utils";

type Brand = {
	id: number;
	name: string;
	domain?: string | null;
	userId?: string | null;
	createdAt: Date | string;
	_count: { assets: number };
};

type FormDialogState =
	| { mode: "create" }
	| { mode: "edit"; brand: Brand }
	| null;

export const Route = createFileRoute("/_authenticated/brands")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getBrandsOptions());
	},
	pendingComponent: () => <BrandGridSkeleton />,
	component: BrandsPage,
});

function BrandsPage() {
	const { data: brands } = useSuspenseQuery(getBrandsOptions());
	const [formDialog, setFormDialog] = useState<FormDialogState>(null);
	const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

	const globalBrands = brands.filter((b) => !b.userId);
	const userBrands = brands.filter((b) => b.userId);

	return (
		<div className="flex flex-col gap-6">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Brands</h1>
					<p className="text-sm text-muted-foreground">
						Manage brand associations for your assets
					</p>
				</div>
				<Button onClick={() => setFormDialog({ mode: "create" })}>
					<Plus />
					New brand
				</Button>
			</header>

			{userBrands.length > 0 && (
				<section className="flex flex-col gap-4">
					<h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Your Brands
					</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{userBrands.map((brand) => (
							<BrandCard
								key={brand.id}
								brand={brand}
								onEdit={() => setFormDialog({ mode: "edit", brand })}
								onDelete={() => setDeleteTarget(brand)}
							/>
						))}
					</div>
				</section>
			)}

			{userBrands.length === 0 && globalBrands.length > 0 && (
				<EmptyState onCreate={() => setFormDialog({ mode: "create" })} />
			)}

			{globalBrands.length > 0 && (
				<section className="flex flex-col gap-4">
					<h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Global Brands
					</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{globalBrands.map((brand) => (
							<BrandCard key={brand.id} brand={brand} />
						))}
					</div>
				</section>
			)}

			{brands.length === 0 && (
				<EmptyState onCreate={() => setFormDialog({ mode: "create" })} />
			)}

			<BrandFormDialog
				key={
					formDialog?.mode === "edit" ? `edit-${formDialog.brand.id}` : "create"
				}
				open={!!formDialog}
				onOpenChange={(open) => !open && setFormDialog(null)}
				brand={formDialog?.mode === "edit" ? formDialog.brand : null}
			/>
			<DeleteBrandDialog
				brand={deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			/>
		</div>
	);
}

function BrandCard({
	brand,
	onEdit,
	onDelete,
}: {
	brand: Brand;
	onEdit?: () => void;
	onDelete?: () => void;
}) {
	const count = brand._count.assets;
	const iconUrl = getBrandIconUrl(brand.domain);
	const isGlobal = !brand.userId;

	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-muted">
						{iconUrl ? (
							<img
								src={iconUrl}
								alt={brand.name}
								className="size-6 object-contain"
								loading="lazy"
							/>
						) : (
							<Tag className="size-5 text-muted-foreground" />
						)}
					</div>
					<div>
						<h3 className="font-semibold">{brand.name}</h3>
						<p className="text-sm text-muted-foreground">
							{brand.domain && <span className="mr-2">{brand.domain}</span>}
							{count} {count === 1 ? "asset" : "assets"}
						</p>
					</div>
				</div>
				{!isGlobal && onEdit && onDelete && (
					<div className="flex gap-1">
						<button
							type="button"
							aria-label={`Edit ${brand.name}`}
							onClick={onEdit}
							className={cn(
								buttonVariants({ variant: "ghost", size: "icon" }),
								"size-8 text-muted-foreground hover:text-foreground",
							)}
						>
							<Pencil className="size-4" />
						</button>
						<button
							type="button"
							aria-label={`Delete ${brand.name}`}
							onClick={onDelete}
							className={cn(
								buttonVariants({ variant: "ghost", size: "icon" }),
								"size-8 text-muted-foreground hover:text-destructive",
							)}
						>
							<Trash2 className="size-4" />
						</button>
					</div>
				)}
			</div>
		</div>
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

function BrandGridSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Brands</h1>
					<p className="text-sm text-muted-foreground">
						Manage brand associations for your assets
					</p>
				</div>
				<Button disabled>
					<Plus />
					New brand
				</Button>
			</header>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{SKELETON_KEYS.map((key) => (
					<div
						key={key}
						className="h-32 animate-pulse rounded-xl border bg-muted/40"
					/>
				))}
			</div>
		</div>
	);
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-muted">
				<Tag className="size-6 text-muted-foreground" />
			</div>
			<h3 className="mt-4 text-lg font-semibold">No custom brands yet</h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">
				Create your own brands to organize your assets. Global brands are
				available to everyone.
			</p>
			<Button onClick={onCreate} className="mt-6">
				<Plus />
				Create brand
			</Button>
		</div>
	);
}
