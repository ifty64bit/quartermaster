import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import * as v from "valibot";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createCategory, updateCategory } from "@/server/queries/categories";

export interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: { id: number; name: string } | null;
}

const QUERY_KEY = ["categories"];

export function CategoryFormDialog({
	open,
	onOpenChange,
	category,
}: CategoryFormDialogProps) {
	const isEdit = !!category;
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (open) {
			setName(category?.name ?? "");
			setError(null);
		}
	}, [open, category]);

	const mutation = useMutation({
		mutationFn: (value: string) => {
			if (isEdit && category) {
				return updateCategory({ data: { id: category.id, name: value } });
			}
			return createCategory({ data: { name: value } });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
			onOpenChange(false);
		},
		onError: (err: Error) => setError(err.message),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = v.safeParse(
			v.pipe(v.string(), v.trim(), v.minLength(1)),
			name,
		);
		if (!result.success) {
			setError("Name is required");
			return;
		}
		mutation.mutate(result.output);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="category-name" className="text-sm font-medium">
							Name
						</label>
						<Input
							id="category-name"
							value={name}
							autoFocus
							placeholder="e.g. Electronics, Camera, Furniture"
							onChange={(e) => {
								setName(e.target.value);
								if (error) setError(null);
							}}
							aria-invalid={!!error}
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</div>
					<DialogFooter>
						<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
							Cancel
						</DialogClose>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending && <Loader2 className="animate-spin" />}
							{isEdit ? "Save changes" : "Create category"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
