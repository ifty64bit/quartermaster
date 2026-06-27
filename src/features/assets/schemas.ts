import * as v from "valibot";

export const quickAddAssetSchema = v.object({
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Name is required"),
		v.maxLength(120, "Name must be 120 characters or fewer"),
	),
	purchasePrice: v.pipe(
		v.number(),
		v.minValue(0, "Price must be 0 or greater"),
	),
	categoryId: v.union([v.number(), v.null()]),
});

export const assetFormSchema = v.object({
	id: v.number(),
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Name is required"),
		v.maxLength(120, "Name must be 120 characters or fewer"),
	),
	model: v.union([v.pipe(v.string(), v.trim(), v.maxLength(120)), v.null()]),
	serial: v.union([v.pipe(v.string(), v.trim(), v.maxLength(120)), v.null()]),
	purchaseDate: v.string(),
	purchasePrice: v.pipe(
		v.number(),
		v.minValue(0, "Price must be 0 or greater"),
	),
	currency: v.pipe(v.string(), v.minLength(3), v.maxLength(3)),
	store: v.union([v.pipe(v.string(), v.trim(), v.maxLength(120)), v.null()]),
	productUrl: v.union([
		v.pipe(v.string(), v.trim(), v.maxLength(2048)),
		v.null(),
	]),
	condition: v.picklist(["new", "used", "refurbished"]),
	warrantyExpiry: v.union([v.string(), v.null()]),
	notes: v.union([v.pipe(v.string(), v.trim(), v.maxLength(2000)), v.null()]),
	categoryId: v.union([v.number(), v.null()]),
	brandId: v.union([v.number(), v.null()]),
});

export type QuickAddValues = v.InferOutput<typeof quickAddAssetSchema>;
export type AssetFormValues = v.InferOutput<typeof assetFormSchema>;
