import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	closeDialog,
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
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAddAsset } from "@/features/assets/apis";
import { assetSchema, type CreateAssetValues } from "@/features/assets/schemas";
import { getCategoriesOptions } from "@/features/categories/apis";
import { cn } from "@/lib/utils";

export interface QuickAddDialogProps {
	defaultCurrency?: string;
	onSubmit?: (data: CreateAssetValues) => Promise<void> | void;
}

export function QuickAddDialog({
	defaultCurrency = "BDT",
}: QuickAddDialogProps) {
	const addAsset = useAddAsset();
	const { data: categories, isLoading } = useQuery(getCategoriesOptions());

	const form = useForm({
		defaultValues: {
			name: "",
			purchasePrice: Number.NaN,
			categoryId: null as number | null,
			currency: defaultCurrency,
		} as CreateAssetValues,
		validators: {
			onChange: assetSchema,
		},
		onSubmit: async ({ value }) => {
			await addAsset.mutateAsync(value);
			form.reset();
			closeDialog();
		},
	});

	return (
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
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="flex flex-col gap-4"
			>
				<form.Field name="name">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor={field.name} className="text-sm font-medium">
								Name <span className="text-destructive">*</span>
							</label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								autoFocus
								placeholder='e.g. "RTX 4070 Super"'
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								aria-invalid={!!field.state.meta.errors.length}
							/>
							{field.state.meta.errors.map((error) => (
								<p key={String(error)} className="text-sm text-destructive">
									{String(error?.message)}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="purchasePrice">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor={field.name} className="text-sm font-medium">
								Price <span className="text-destructive">*</span>
							</label>
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground tabular-nums">
									{defaultCurrency}
								</span>
								<Input
									id={field.name}
									name={field.name}
									type="number"
									inputMode="decimal"
									min="0"
									step="0.01"
									value={
										Number.isNaN(field.state.value) ? "" : field.state.value
									}
									placeholder="599"
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(
											e.target.value === ""
												? Number.NaN
												: Number(e.target.value),
										)
									}
									aria-invalid={!!field.state.meta.errors.length}
									className="flex-1"
								/>
							</div>
							{field.state.meta.errors.map((error) => (
								<p key={String(error)} className="text-sm text-destructive">
									{String(error?.message)}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<form.Field name="categoryId">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor={field.name} className="text-sm font-medium">
								Category
							</label>
							<Select
								items={categories?.map((cat) => ({
									label: cat.name,
									value: cat.id,
								}))}
								value={field.state.value}
								onValueChange={(val) =>
									field.handleChange(val === null ? null : Number(val))
								}
							>
								<SelectTrigger disabled={isLoading}>
									<SelectValue placeholder="Pick a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{categories?.map((cat) => (
											<SelectItem key={cat.id} value={cat.id}>
												{cat.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{field.state.meta.errors.map((error) => (
								<p key={String(error)} className="text-sm text-destructive">
									{String(error?.message)}
								</p>
							))}
						</div>
					)}
				</form.Field>

				<DialogFooter>
					<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
						Cancel
					</DialogClose>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button type="submit" disabled={!canSubmit || isSubmitting}>
								{isSubmitting && <Loader2 className="animate-spin" />}
								Add asset
							</Button>
						)}
					</form.Subscribe>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
