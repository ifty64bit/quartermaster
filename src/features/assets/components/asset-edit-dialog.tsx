import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Loader2, Pencil } from "lucide-react";
import type * as React from "react";
import { cloneElement, isValidElement, useId } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	closeDialog,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { useUpdateAsset } from "@/features/assets/apis";
import { type AssetFormValues, assetSchema } from "@/features/assets/schemas";
import type { Asset, AssetCondition } from "@/features/assets/types";
import type { CurrencyCode } from "@/features/assets/utils";
import { completeness } from "@/features/assets/utils";
import { getBrandsOptions } from "@/features/brands/apis";
import { getCategoriesOptions } from "@/features/categories/apis";
import { cn } from "@/lib/utils";

const CONDITIONS: { value: AssetCondition; label: string }[] = [
	{ value: "new", label: "New" },
	{ value: "used", label: "Used" },
	{ value: "refurbished", label: "Refurbished" },
];

function toDateString(date: Date | null | undefined): string {
	if (!date) return "";
	return dayjs(date).format("YYYY-MM-DD");
}

export function AssetEditDialog({ asset }: { asset: Asset }) {
	const { data: categories } = useQuery(getCategoriesOptions());
	const { data: brands } = useQuery(getBrandsOptions());
	const updateAsset = useUpdateAsset();
	const pct = completeness(asset);

	const form = useForm({
		defaultValues: {
			id: asset.id,
			name: asset.name,
			model: asset.model ?? null,
			serial: asset.serial ?? null,
			store: asset.store ?? null,
			productUrl: asset.productUrl ?? null,
			purchaseDate: toDateString(asset.purchaseDate),
			purchasePrice: asset.purchasePrice,
			currency: asset.currency,
			warrantyExpiry: toDateString(asset.warrantyExpiry) || null,
			condition: asset.condition as AssetCondition,
			notes: asset.notes ?? null,
			categoryId: asset.categoryId ?? null,
			brandId: asset.brandId ?? null,
		} as AssetFormValues,
		validators: {
			onChange: assetSchema,
		},
		onSubmit: async ({ value }) => {
			await updateAsset.mutateAsync(value);
			closeDialog();
		},
	});

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="ghost" size={"icon"}>
						<Pencil className="size-4" />
					</Button>
				}
			/>

			<DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start justify-between gap-3">
						<div className="flex flex-col gap-1">
							<DialogTitle>{asset.name}</DialogTitle>
							<DialogDescription>
								Fill in the details whenever you have time.
							</DialogDescription>
						</div>
						<CompletenessBadge pct={pct} />
					</div>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<fieldset className="flex flex-col gap-4">
						<legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Basics
						</legend>

						<form.Field name="name">
							{(field) => (
								<FormField
									label="Name"
									required
									error={field.state.meta.errors[0]?.message}
								>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={!!field.state.meta.errors.length}
									/>
								</FormField>
							)}
						</form.Field>

						<div className="grid grid-cols-2 gap-3">
							<form.Field name="brandId">
								{(field) => (
									<FormField
										label="Brand"
										error={field.state.meta.errors[0]?.message}
									>
										<Select
											items={brands?.map((b) => ({
												value: b.id,
												label: b.name,
											}))}
											value={field.state.value}
											onValueChange={(val) =>
												field.handleChange(val === null ? null : Number(val))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select brand" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{brands?.map((b) => (
														<SelectItem key={b.id} value={b.id}>
															{b.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormField>
								)}
							</form.Field>

							<form.Field name="categoryId">
								{(field) => (
									<FormField
										label="Category"
										error={field.state.meta.errors[0]?.message}
									>
										<Select
											items={categories?.map((c) => ({
												value: c.id,
												label: c.name,
											}))}
											value={field.state.value}
											onValueChange={(val) =>
												field.handleChange(val === null ? null : Number(val))
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{categories?.map((c) => (
														<SelectItem key={c.id} value={c.id}>
															{c.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</FormField>
								)}
							</form.Field>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<form.Field name="model">
								{(field) => (
									<FormField
										label="Model"
										error={field.state.meta.errors[0]?.message}
									>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value ?? ""}
											placeholder="e.g. MX Master 3S"
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value === "" ? null : e.target.value,
												)
											}
										/>
									</FormField>
								)}
							</form.Field>
							<form.Field name="serial">
								{(field) => (
									<FormField
										label="Serial"
										error={field.state.meta.errors[0]?.message}
									>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value ?? ""}
											placeholder="For warranty claims"
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value === "" ? null : e.target.value,
												)
											}
										/>
									</FormField>
								)}
							</form.Field>
						</div>
					</fieldset>

					<fieldset className="flex flex-col gap-4">
						<legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Purchase
						</legend>
						<div className="grid grid-cols-2 gap-3">
							<form.Field name="purchaseDate">
								{(field) => (
									<FormField
										label="Purchase date"
										error={field.state.meta.errors[0]?.message}
									>
										<Input
											type="date"
											id={field.name}
											name={field.name}
											value={toDateString(
												field.state.value ? new Date(field.state.value) : null,
											)}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value
														? dayjs(e.target.value).toISOString()
														: "",
												)
											}
										/>
									</FormField>
								)}
							</form.Field>
							<div className="grid grid-cols-[1fr_auto] gap-3">
								<form.Field name="purchasePrice">
									{(field) => (
										<FormField
											label="Price"
											required
											error={field.state.meta.errors[0]?.message}
										>
											<Input
												type="number"
												inputMode="decimal"
												min="0"
												step="0.01"
												id={field.name}
												name={field.name}
												value={
													Number.isNaN(field.state.value)
														? ""
														: field.state.value
												}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value === ""
															? Number.NaN
															: Number(e.target.value),
													)
												}
												aria-invalid={!!field.state.meta.errors.length}
											/>
										</FormField>
									)}
								</form.Field>
								<form.Field name="currency">
									{(field) => (
										<FormField
											label="Currency"
											error={field.state.meta.errors[0]?.message}
										>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value ?? ""}
												maxLength={3}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value.toUpperCase() as CurrencyCode,
													)
												}
												className="w-20 uppercase"
											/>
										</FormField>
									)}
								</form.Field>
							</div>
						</div>
						<form.Field name="store">
							{(field) => (
								<FormField
									label="Store / vendor"
									error={field.state.meta.errors[0]?.message}
								>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value ?? ""}
										placeholder="Where you bought it"
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value === "" ? null : e.target.value,
											)
										}
									/>
								</FormField>
							)}
						</form.Field>
						<form.Field name="productUrl">
							{(field) => (
								<FormField
									label="Product URL"
									error={field.state.meta.errors[0]?.message}
								>
									<Input
										type="url"
										id={field.name}
										name={field.name}
										value={field.state.value ?? ""}
										placeholder="https://"
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value === "" ? null : e.target.value,
											)
										}
									/>
								</FormField>
							)}
						</form.Field>
					</fieldset>

					<fieldset className="flex flex-col gap-4">
						<legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Warranty & condition
						</legend>
						<div className="grid grid-cols-2 gap-3">
							<form.Field name="condition">
								{(field) => (
									<FormField
										label="Condition"
										error={field.state.meta.errors[0]?.message}
									>
										<Select
											items={CONDITIONS}
											value={field.state.value}
											onValueChange={(val) =>
												field.handleChange(val as AssetCondition)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{CONDITIONS.map((c) => (
													<SelectItem key={c.value} value={c.value}>
														{c.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormField>
								)}
							</form.Field>
							<form.Field name="warrantyExpiry">
								{(field) => (
									<FormField
										label="Warranty expiry"
										error={field.state.meta.errors[0]?.message}
									>
										<Input
											type="date"
											id={field.name}
											name={field.name}
											value={
												field.state.value
													? toDateString(new Date(field.state.value))
													: ""
											}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value
														? dayjs(e.target.value).toISOString()
														: null,
												)
											}
										/>
									</FormField>
								)}
							</form.Field>
						</div>
						<form.Field name="notes">
							{(field) => (
								<FormField
									label="Notes"
									error={field.state.meta.errors[0]?.message}
								>
									<textarea
										id={field.name}
										name={field.name}
										value={field.state.value ?? ""}
										placeholder="Anything worth remembering"
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(
												e.target.value === "" ? null : e.target.value,
											)
										}
										rows={3}
										className={cn(
											"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-hidden",
											"placeholder:text-muted-foreground",
											"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
										)}
									/>
								</FormField>
							)}
						</form.Field>
					</fieldset>

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
									Save changes
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function FormField({
	label,
	required,
	error,
	children,
}: {
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
}) {
	const autoId = useId();
	const fieldId = `field-${autoId}`;
	const controlled = isValidElement(children)
		? cloneElement(children as React.ReactElement<{ id?: string }>, {
				id: fieldId,
			})
		: children;
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={fieldId} className="text-sm font-medium">
				{label}
				{required && <span className="text-destructive"> *</span>}
			</label>
			{controlled}
			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}

function CompletenessBadge({ pct }: { pct: number }) {
	const color =
		pct === 100
			? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
			: pct >= 50
				? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
				: "bg-muted text-muted-foreground";
	return (
		<div
			className={cn(
				"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
				color,
			)}
		>
			{pct === 100 ? "Complete" : `${pct}%`}
		</div>
	);
}
