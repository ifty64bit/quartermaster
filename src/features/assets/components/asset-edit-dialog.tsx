import { Loader2 } from "lucide-react";
import type * as React from "react";
import {
	cloneElement,
	isValidElement,
	useEffect,
	useId,
	useState,
} from "react";
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
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { assetSchema } from "@/features/assets/schemas";
import type {
	Asset,
	AssetCondition,
	Brand,
	Category,
} from "@/features/assets/types";
import { completeness } from "@/features/assets/utils";
import { cn, formatDate } from "@/lib/utils";

export interface AssetEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	asset: Asset | null;
	categories: Category[];
	brands: Brand[];
	onSubmit: (data: AssetFormInput) => Promise<void> | void;
}

export type AssetFormInput = Omit<
	Asset,
	"category" | "brand" | "createdAt" | "updatedAt"
> & {
	categoryId: number | null;
	brandId: number | null;
};

type FieldErrors = Partial<Record<keyof AssetFormInput, string>>;

const CONDITIONS: { value: AssetCondition; label: string }[] = [
	{ value: "new", label: "New" },
	{ value: "used", label: "Used" },
	{ value: "refurbished", label: "Refurbished" },
];

function toEmptyIfNull(value: string | null): string {
	return value ?? "";
}

export function AssetEditDialog({
	open,
	onOpenChange,
	asset,
	categories,
	brands,
	onSubmit,
}: AssetEditDialogProps) {
	const [form, setForm] = useState<AssetFormInput | null>(null);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open && asset) {
			setForm({
				id: asset.id,
				name: asset.name,
				model: asset.model,
				serial: asset.serial,
				purchaseDate: asset.purchaseDate,
				purchasePrice: asset.purchasePrice,
				currency: asset.currency,
				store: asset.store,
				productUrl: asset.productUrl,
				condition: asset.condition,
				warrantyExpiry: asset.warrantyExpiry,
				notes: asset.notes,
				categoryId: asset.categoryId,
				brandId: asset.brandId,
				ownerId: asset.ownerId,
			});
			setErrors({});
			setSubmitting(false);
		}
	}, [open, asset]);

	if (!form) return null;

	const pct = asset ? completeness(asset) : 0;

	function update<K extends keyof AssetFormInput>(
		key: K,
		value: AssetFormInput[K],
	) {
		setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form) return;
		const parsed = v.safeParse(assetSchema, {
			...form,
			purchaseDate:
				form.purchaseDate instanceof Date
					? form.purchaseDate.toISOString()
					: form.purchaseDate,
			warrantyExpiry:
				form.warrantyExpiry instanceof Date
					? form.warrantyExpiry.toISOString()
					: form.warrantyExpiry,
		});
		if (!parsed.success) {
			const next: FieldErrors = {};
			for (const issue of parsed.issues) {
				const key = issue.path?.[0]?.key as keyof AssetFormInput;
				if (key && !next[key]) next[key] = issue.message;
			}
			setErrors(next);
			return;
		}
		setSubmitting(true);
		const formInput: AssetFormInput = {
			...parsed.output,
			id: form.id,
			ownerId: form.ownerId,
			purchaseDate: parsed.output.purchaseDate
				? new Date(parsed.output.purchaseDate)
				: new Date(),
			warrantyExpiry: parsed.output.warrantyExpiry
				? new Date(parsed.output.warrantyExpiry)
				: null,
		} as AssetFormInput;
		Promise.resolve(onSubmit(formInput))
			.then(() => onOpenChange(false))
			.finally(() => setSubmitting(false));
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start justify-between gap-3">
						<div className="flex flex-col gap-1">
							<DialogTitle>{asset?.name ?? "Edit asset"}</DialogTitle>
							<DialogDescription>
								Fill in the details whenever you have time.
							</DialogDescription>
						</div>
						<CompletenessBadge pct={pct} />
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<fieldset className="flex flex-col gap-4">
						<legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Basics
						</legend>
						<FormField label="Name" required error={errors.name}>
							<Input
								value={form.name}
								onChange={(e) => update("name", e.target.value)}
								aria-invalid={!!errors.name}
							/>
						</FormField>

						<div className="grid grid-cols-2 gap-3">
							<FormField label="Brand" error={errors.brandId}>
								<Select
									value={form.brandId}
									onValueChange={(val) =>
										update("brandId", val === null ? null : Number(val))
									}
									items={brands.map((b) => ({
										value: b.id,
										label: b.name,
									}))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select brand" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{brands.map((b) => (
												<SelectItem key={b.id} value={b.id}>
													{b.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormField>

							<FormField label="Category" error={errors.categoryId}>
								<Select
									value={form.categoryId}
									onValueChange={(val) =>
										update("categoryId", val === null ? null : Number(val))
									}
									items={categories.map((c) => ({
										value: c.id,
										label: c.name,
									}))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{categories.map((c) => (
												<SelectItem key={c.id} value={c.id}>
													{c.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormField>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<FormField label="Model" error={errors.model}>
								<Input
									value={toEmptyIfNull(form.model)}
									placeholder="e.g. MX Master 3S"
									onChange={(e) => update("model", e.target.value)}
								/>
							</FormField>
							<FormField label="Serial" error={errors.serial}>
								<Input
									value={toEmptyIfNull(form.serial)}
									placeholder="For warranty claims"
									onChange={(e) => update("serial", e.target.value)}
								/>
							</FormField>
						</div>
					</fieldset>

					<fieldset className="flex flex-col gap-4">
						<legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Purchase
						</legend>
						<div className="grid grid-cols-2 gap-3">
							<FormField label="Purchase date" error={errors.purchaseDate}>
								<Input
									type="date"
									value={formatDate(form.purchaseDate)}
									onChange={(e) =>
										update(
											"purchaseDate",
											e.target.value ? new Date(e.target.value) : new Date(),
										)
									}
								/>
							</FormField>
							<div className="grid grid-cols-[1fr_auto] gap-3">
								<FormField label="Price" required error={errors.purchasePrice}>
									<Input
										type="number"
										inputMode="decimal"
										min="0"
										step="0.01"
										value={
											Number.isNaN(form.purchasePrice) ? "" : form.purchasePrice
										}
										onChange={(e) =>
											update(
												"purchasePrice",
												e.target.value === ""
													? Number.NaN
													: Number(e.target.value),
											)
										}
										aria-invalid={!!errors.purchasePrice}
									/>
								</FormField>
								<FormField label="Currency" error={errors.currency}>
									<Input
										value={form.currency}
										maxLength={3}
										onChange={(e) =>
											update("currency", e.target.value.toUpperCase())
										}
										className="w-20 uppercase"
									/>
								</FormField>
							</div>
						</div>
						<FormField label="Store / vendor" error={errors.store}>
							<Input
								value={toEmptyIfNull(form.store)}
								placeholder="Where you bought it"
								onChange={(e) => update("store", e.target.value)}
							/>
						</FormField>
						<FormField label="Product URL" error={errors.productUrl}>
							<Input
								type="url"
								value={toEmptyIfNull(form.productUrl)}
								placeholder="https://"
								onChange={(e) => update("productUrl", e.target.value)}
							/>
						</FormField>
					</fieldset>

					<fieldset className="flex flex-col gap-4">
						<legend className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							Warranty & condition
						</legend>
						<div className="grid grid-cols-2 gap-3">
							<FormField label="Condition" error={errors.condition}>
								<Select
									value={form.condition}
									onValueChange={(val) =>
										update("condition", val as AssetCondition)
									}
									items={CONDITIONS}
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
							<FormField label="Warranty expiry" error={errors.warrantyExpiry}>
								<Input
									type="date"
									value={
										form.warrantyExpiry ? formatDate(form.warrantyExpiry) : ""
									}
									onChange={(e) =>
										update(
											"warrantyExpiry",
											e.target.value === "" ? null : new Date(e.target.value),
										)
									}
								/>
							</FormField>
						</div>
						<FormField label="Notes" error={errors.notes}>
							<textarea
								value={toEmptyIfNull(form.notes)}
								placeholder="Anything worth remembering"
								onChange={(e) => update("notes", e.target.value)}
								rows={3}
								className={cn(
									"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-hidden",
									"placeholder:text-muted-foreground",
									"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
								)}
							/>
						</FormField>
					</fieldset>

					<DialogFooter>
						<DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
							Cancel
						</DialogClose>
						<Button type="submit" disabled={submitting}>
							{submitting && <Loader2 className="animate-spin" />}
							Save changes
						</Button>
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
