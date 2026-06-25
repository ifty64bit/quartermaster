import * as v from "valibot";

export const signUpSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(2, "Name must be at least 2 characters"),
		v.trim(),
	),
	email: v.pipe(v.string(), v.trim(), v.email("Enter a valid email")),
	password: v.pipe(
		v.string(),
		v.minLength(8, "Password must be at least 8 characters"),
		v.regex(/[A-Za-z]/, "Add at least one letter"),
		v.regex(/[0-9]/, "Add at least one number"),
	),
	confirmPassword: v.pipe(
		v.string(),
		v.minLength(1, "Please confirm your password"),
	),
});
