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
import { createBrand, updateBrand } from "@/server/queries/brands";

export interface BrandFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	brand?: { id: number; name: string; domain?: string | null } | null;
}

const QUERY_KEY = ["brands"];

export function BrandFormDialog({
	open,
	onOpenChange,
	brand,
}: BrandFormDialogProps) {
	const isEdit = !!brand;
	const [name, setName] = useState("");
	const [domain, setDomain] = useState("");
	const [error, setError] = useState<string | null>(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (open) {
			setName(brand?.name ?? "");
			setDomain(brand?.domain ?? "");
			setError(null);
		}
	}, [open, brand]);

	const mutation = useMutation({
		mutationFn: (values: { name: string; domain?: string }) => {
			if (isEdit && brand) {
				return updateBrand({
					data: { id: brand.id, name: values.name, domain: values.domain },
				});
			}
			return createBrand({ data: values });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
			onOpenChange(false);
		},
		onError: (err: Error) => setError(err.message),
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const nameResult = v.safeParse(
			v.pipe(v.string(), v.trim(), v.minLength(1)),
			name,
		);
		if (!nameResult.success) {
			setError("Name is required");
			return;
		}
		mutation.mutate({
			name: nameResult.output,
			domain: domain.trim() || undefined,
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit brand" : "New brand"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="brand-name" className="text-sm font-medium">
							Name
						</label>
						<Input
							id="brand-name"
							value={name}
							autoFocus
							placeholder="e.g. Apple, Samsung, Sony"
							onChange={(e) => {
								setName(e.target.value);
								if (error) setError(null);
							}}
							aria-invalid={!!error}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="brand-domain" className="text-sm font-medium">
							Domain{" "}
							<span className="text-xs text-muted-foreground">(optional)</span>
						</label>
						<Input
							id="brand-domain"
							value={domain}
							placeholder="e.g. apple.com"
							onChange={(e) => {
								setDomain(e.target.value);
								if (error) setError(null);
							}}
						/>
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<DialogFooter>
						<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
							Cancel
						</DialogClose>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending && <Loader2 className="animate-spin" />}
							{isEdit ? "Save changes" : "Create brand"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
