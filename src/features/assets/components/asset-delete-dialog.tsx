import { Trash } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	closeDialog,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDeleteAsset } from "../apis";
import type { Asset } from "../types";

function AssetDeleteDialog({ asset }: { asset: Asset }) {
	const deleteAsset = useDeleteAsset();
	const handleDelete = () => {
		deleteAsset.mutate(asset.id, {
			onSuccess: () => {
				closeDialog();
			},
		});
	};

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant={"ghost"}
						size="icon"
						className="text-destructive hover:bg-destructive/10"
					>
						<Trash />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className={"text-destructive"}>
						Delete {asset.name}?
					</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					This action cannot be undone. Are you sure you want to delete this
					asset?
				</p>
				<DialogFooter>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteAsset.isPending}
					>
						{deleteAsset.isPending ? "Deleting..." : "Delete"}
					</Button>
					<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
						Cancel
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AssetDeleteDialog;
