import * as v from "valibot";

export const categoryNameSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(1, "Name is required"),
		v.maxLength(50, "Name must be 50 characters or fewer"),
		v.trim(),
	),
	icon: v.optional(
		v.pipe(v.string(), v.maxLength(10, "Icon must be 10 characters or fewer")),
	),
});

export const updateCategorySchema = v.object({
	id: v.number(),
	name: v.pipe(
		v.string(),
		v.minLength(1, "Name is required"),
		v.maxLength(50, "Name must be 50 characters or fewer"),
		v.trim(),
	),
	icon: v.optional(
		v.pipe(v.string(), v.maxLength(10, "Icon must be 10 characters or fewer")),
	),
});
