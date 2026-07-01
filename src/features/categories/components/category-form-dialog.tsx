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
import { categoryNameSchema } from "../schemas";

export interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: { id: number; name: string; icon?: string | null } | null;
}

const QUERY_KEY = ["categories"];

export function CategoryFormDialog({
	open,
	onOpenChange,
	category,
}: CategoryFormDialogProps) {
	const isEdit = !!category;
	const [name, setName] = useState("");
	const [icon, setIcon] = useState("");
	const [errors, setErrors] = useState<{
		name?: string;
		icon?: string;
		general?: string;
	}>({});
	const queryClient = useQueryClient();

	useEffect(() => {
		if (open) {
			setName(category?.name ?? "");
			setIcon(category?.icon ?? "");
			setErrors({});
		}
	}, [open, category]);

	const mutation = useMutation({
		mutationFn: (value: { name: string; icon?: string }) => {
			if (isEdit && category) {
				return updateCategory({
					data: { id: category.id, name: value.name, icon: value.icon },
				});
			}
			return createCategory({
				data: { name: value.name, icon: value.icon },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
			onOpenChange(false);
		},
		onError: (err: Error) =>
			setErrors((prev) => ({ ...prev, general: err.message })),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const result = v.safeParse(categoryNameSchema, {
			name,
			icon: icon || undefined,
		});
		if (!result.success) {
			const fieldErrors: { name?: string; icon?: string } = {};
			for (const issue of result.issues) {
				if (issue.path?.[0]?.key === "name" && !fieldErrors.name) {
					fieldErrors.name = issue.message;
				}
				if (issue.path?.[0]?.key === "icon" && !fieldErrors.icon) {
					fieldErrors.icon = issue.message;
				}
			}
			setErrors((prev) => ({
				...prev,
				name: fieldErrors.name,
				icon: fieldErrors.icon,
			}));
			return;
		}
		mutation.mutate({ name: result.output.name, icon: result.output.icon });
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
								if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
							}}
							aria-invalid={!!errors.name}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name}</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="category-icon" className="text-sm font-medium">
							Icon (emoji)
						</label>
						<div className="flex items-center gap-3">
							{icon && (
								<span className="text-2xl leading-none" aria-hidden>
									{icon}
								</span>
							)}
							<Input
								id="category-icon"
								value={icon}
								placeholder="e.g. 🖥️"
								onChange={(e) => {
									setIcon(e.target.value);
									if (errors.icon)
										setErrors((p) => ({ ...p, icon: undefined }));
								}}
								aria-invalid={!!errors.icon}
								className="flex-1"
							/>
						</div>
						{errors.icon && (
							<p className="text-sm text-destructive">{errors.icon}</p>
						)}
					</div>
					{errors.general && (
						<p className="text-sm text-destructive">{errors.general}</p>
					)}
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
