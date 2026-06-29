import * as v from "valibot";

export const brandNameSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(1, "Name is required"),
		v.maxLength(50, "Name must be 50 characters or fewer"),
		v.trim(),
	),
	domain: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(100, "Domain must be 100 characters or fewer"),
			v.trim(),
		),
	),
});

export const updateBrandSchema = v.object({
	id: v.number(),
	name: v.pipe(
		v.string(),
		v.minLength(1, "Name is required"),
		v.maxLength(50, "Name must be 50 characters or fewer"),
		v.trim(),
	),
	domain: v.optional(
		v.pipe(
			v.string(),
			v.maxLength(100, "Domain must be 100 characters or fewer"),
			v.trim(),
		),
	),
});
