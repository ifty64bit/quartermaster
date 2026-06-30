import * as v from "valibot";
import { ISO_CURRENCIES } from "@/features/assets/utils";

export const assetSchema = v.object({
	id: v.optional(v.number()),
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Name is required"),
		v.maxLength(120, "Name must be 120 characters or fewer"),
	),
	model: v.optional(
		v.union([v.pipe(v.string(), v.trim(), v.maxLength(120)), v.null()]),
	),
	serial: v.optional(
		v.union([v.pipe(v.string(), v.trim(), v.maxLength(120)), v.null()]),
	),
	purchaseDate: v.optional(v.string()),
	purchasePrice: v.pipe(
		v.number(),
		v.minValue(0, "Price must be 0 or greater"),
	),
	currency: v.optional(v.picklist(ISO_CURRENCIES, "Invalid currency code")),
	store: v.optional(
		v.union([v.pipe(v.string(), v.trim(), v.maxLength(120)), v.null()]),
	),
	productUrl: v.optional(
		v.union([v.pipe(v.string(), v.trim(), v.maxLength(2048)), v.null()]),
	),
	condition: v.optional(v.picklist(["new", "used", "refurbished"])),
	warrantyExpiry: v.optional(v.union([v.string(), v.null()])),
	notes: v.optional(
		v.union([v.pipe(v.string(), v.trim(), v.maxLength(2000)), v.null()]),
	),
	categoryId: v.optional(v.union([v.number(), v.null()])),
	brandId: v.optional(v.union([v.number(), v.null()])),
});

export const createAssetSchema = v.omit(assetSchema, ["id"]);

export type AssetFormValues = v.InferOutput<typeof assetSchema>;
export type CreateAssetValues = v.InferOutput<typeof createAssetSchema>;
