import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getCategoriesOptions } from "@/features/categories/apis";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { DeleteCategoryDialog } from "@/features/categories/components/delete-category-dialog";
import { cn } from "@/lib/utils";

type Category = {
	id: number;
	name: string;
	createdAt: Date | string;
	_count: { assets: number };
};

type FormDialogState =
	| { mode: "create" }
	| { mode: "edit"; category: Category }
	| null;

export const Route = createFileRoute("/_authenticated/categories")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getCategoriesOptions());
	},
	pendingComponent: () => <CategoryGridSkeleton />,
	component: CategoriesPage,
});

function CategoriesPage() {
	const { data: categories } = useSuspenseQuery(getCategoriesOptions());
	const [formDialog, setFormDialog] = useState<FormDialogState>(null);
	const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

	return (
		<div className="flex flex-col gap-6">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Categories</h1>
					<p className="text-sm text-muted-foreground">
						Organize your assets into meaningful groups
					</p>
				</div>
				<Button onClick={() => setFormDialog({ mode: "create" })}>
					<Plus />
					New category
				</Button>
			</header>

			{categories.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((category) => (
						<CategoryCard
							key={category.id}
							category={category}
							onEdit={() => setFormDialog({ mode: "edit", category })}
							onDelete={() => setDeleteTarget(category)}
						/>
					))}
				</div>
			) : (
				<EmptyState onCreate={() => setFormDialog({ mode: "create" })} />
			)}

			<CategoryFormDialog
				key={
					formDialog?.mode === "edit"
						? `edit-${formDialog.category.id}`
						: "create"
				}
				open={!!formDialog}
				onOpenChange={(open) => !open && setFormDialog(null)}
				category={formDialog?.mode === "edit" ? formDialog.category : null}
			/>
			<DeleteCategoryDialog
				category={deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			/>
		</div>
	);
}

function CategoryCard({
	category,
	onEdit,
	onDelete,
}: {
	category: Category;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const count = category._count.assets;
	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-lg bg-muted">
						<FolderTree className="size-5 text-muted-foreground" />
					</div>
					<div>
						<h3 className="font-semibold">{category.name}</h3>
						<p className="text-sm text-muted-foreground">
							{count} {count === 1 ? "asset" : "assets"}
						</p>
					</div>
				</div>
				<div className="flex gap-1">
					<button
						type="button"
						aria-label={`Edit ${category.name}`}
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
						aria-label={`Delete ${category.name}`}
						onClick={onDelete}
						className={cn(
							buttonVariants({ variant: "ghost", size: "icon" }),
							"size-8 text-muted-foreground hover:text-destructive",
						)}
					>
						<Trash2 className="size-4" />
					</button>
				</div>
			</div>
			<p className="text-xs text-muted-foreground">
				Created {new Date(category.createdAt).toLocaleDateString()}
			</p>
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

function CategoryGridSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<header className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Categories</h1>
					<p className="text-sm text-muted-foreground">
						Organize your assets into meaningful groups
					</p>
				</div>
				<Button disabled>
					<Plus />
					New category
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
				<FolderTree className="size-6 text-muted-foreground" />
			</div>
			<h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">
				Create your first category to start organizing your assets — PCs,
				cameras, furniture, and more.
			</p>
			<Button onClick={onCreate} className="mt-6">
				<Plus />
				Create category
			</Button>
		</div>
	);
}
