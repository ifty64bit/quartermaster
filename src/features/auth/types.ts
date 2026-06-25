import type * as v from "valibot";
import type { signUpSchema } from "./schemas";

export type SignUpValues = v.InferInput<typeof signUpSchema>;
