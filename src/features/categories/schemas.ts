import * as v from "valibot";

export const categoryNameSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(1, "Name is required"),
		v.maxLength(50, "Name must be 50 characters or fewer"),
		v.trim(),
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
});
