import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { deleteCategory } from "@/server/queries/categories";

export interface DeleteCategoryDialogProps {
	category: { id: number; name: string; _count: { assets: number } } | null;
	onOpenChange: (open: boolean) => void;
}

const QUERY_KEY = ["categories"];

export function DeleteCategoryDialog({
	category,
	onOpenChange,
}: DeleteCategoryDialogProps) {
	const queryClient = useQueryClient();
	const open = !!category;

	const mutation = useMutation({
		mutationFn: (id: number) => deleteCategory({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
			onOpenChange(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<div className="flex items-start gap-4">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="size-5 text-destructive" />
					</div>
					<div className="flex-1">
						<DialogTitle>Delete category</DialogTitle>
						<DialogDescription className="mt-1">
							Are you sure you want to delete{" "}
							<span className="font-medium text-foreground">
								{category?.name}
							</span>
							?
							{category && category._count.assets > 0 && (
								<span className="mt-2 block">
									{category._count.assets}{" "}
									{category._count.assets === 1 ? "asset" : "assets"} will be
									uncategorized but not deleted.
								</span>
							)}
						</DialogDescription>
					</div>
				</div>
				<DialogFooter>
					<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
						Cancel
					</DialogClose>
					<Button
						variant="destructive"
						disabled={mutation.isPending}
						onClick={() => category && mutation.mutate(category.id)}
					>
						{mutation.isPending && <Loader2 className="animate-spin" />}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
