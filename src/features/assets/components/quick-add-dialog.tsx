import { Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import * as v from "valibot";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { quickAddAssetSchema } from "@/features/assets/schemas";
import type { Category, QuickAddAsset } from "@/features/assets/types";
import { cn } from "@/lib/utils";

export interface QuickAddDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	defaultCurrency?: string;
	onSubmit: (data: QuickAddAsset) => Promise<void> | void;
}

export function QuickAddDialog({
	open,
	onOpenChange,
	categories,
	defaultCurrency = "USD",
	onSubmit,
}: QuickAddDialogProps) {
	const [name, setName] = useState("");
	const [priceInput, setPriceInput] = useState("");
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open) {
			setName("");
			setPriceInput("");
			setCategoryId(null);
			setErrors({});
			setSubmitting(false);
		}
	}, [open]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const parsed = v.safeParse(quickAddAssetSchema, {
			name,
			purchasePrice: priceInput === "" ? NaN : Number(priceInput),
			categoryId,
		});
		if (!parsed.success) {
			const next: Record<string, string> = {};
			for (const issue of parsed.issues) {
				const key = issue.path?.[0]?.key as string | undefined;
				if (key && !next[key]) next[key] = issue.message;
			}
			setErrors(next);
			return;
		}
		setSubmitting(true);
		Promise.resolve(
			onSubmit({
				name: parsed.output.name,
				purchasePrice: parsed.output.purchasePrice,
				categoryId: parsed.output.categoryId,
			}),
		)
			.then(() => onOpenChange(false))
			.finally(() => setSubmitting(false));
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Zap className="size-5" />
					</div>
					<DialogTitle>Quick add asset</DialogTitle>
					<DialogDescription>
						Just the essentials. Fill in the details later from your inventory.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<label htmlFor="qa-name" className="text-sm font-medium">
							Name <span className="text-destructive">*</span>
						</label>
						<Input
							id="qa-name"
							value={name}
							autoFocus
							placeholder='e.g. "RTX 4070 Super"'
							onChange={(e) => {
								setName(e.target.value);
								if (errors.name) setErrors((p) => ({ ...p, name: "" }));
							}}
							aria-invalid={!!errors.name}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name}</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="qa-price" className="text-sm font-medium">
							Price <span className="text-destructive">*</span>
						</label>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground tabular-nums">
								{defaultCurrency}
							</span>
							<Input
								id="qa-price"
								type="number"
								inputMode="decimal"
								min="0"
								step="0.01"
								value={priceInput}
								placeholder="599"
								onChange={(e) => {
									setPriceInput(e.target.value);
									if (errors.purchasePrice)
										setErrors((p) => ({
											...p,
											purchasePrice: "",
										}));
								}}
								aria-invalid={!!errors.purchasePrice}
								className="flex-1"
							/>
						</div>
						{errors.purchasePrice && (
							<p className="text-sm text-destructive">{errors.purchasePrice}</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="qa-category" className="text-sm font-medium">
							Category
						</label>
						<Select
							value={categoryId}
							onValueChange={(val) =>
								setCategoryId(val === null ? null : Number(val))
							}
							items={categories.map((c) => ({
								value: c.id,
								label: c.name,
							}))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Pick a category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
							Cancel
						</DialogClose>
						<Button type="submit" disabled={submitting}>
							{submitting && <Loader2 className="animate-spin" />}
							Add asset
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
