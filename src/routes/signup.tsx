import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	PackageCheck,
	User,
} from "lucide-react";
import { useState } from "react";
import { AuthBrandPanel } from "@/components/layout/auth-brand-panel";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/features/auth/schemas";
import type { SignUpValues } from "@/features/auth/types";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/signup")({ component: SignUpPage });

function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		} as SignUpValues,
		validators: {
			onChange: signUpSchema,
		},
		onSubmit: async ({ value }) => {
			if (value.confirmPassword !== value.password) {
				setError("Passwords do not match");
				return;
			}
			setError(null);
			const { error: signUpError } = await authClient.signUp.email({
				email: value.email,
				password: value.password,
				name: value.name,
			});
			if (signUpError) {
				setError(signUpError.message ?? "Unable to create account.");
			}
		},
	});

	return (
		<main className="relative flex min-h-svh items-stretch bg-background">
			<AuthBrandPanel />

			<section className="flex flex-1 items-center justify-center p-6 sm:p-10">
				<div className="w-full max-w-sm">
					<div className="mb-8 flex items-center gap-2 lg:hidden">
						<PackageCheck className="size-6" />
						<span className="text-lg font-semibold tracking-tight">
							Quartermaster
						</span>
					</div>

					<Card className="border-none shadow-lg sm:shadow-xl">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl">Create account</CardTitle>
							<CardDescription>
								Start tracking your assets in minutes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									void form.handleSubmit();
								}}
								className="space-y-4"
							>
								<form.Field name="name">
									{(field) => (
										<div className="space-y-2">
											<label
												htmlFor={field.name}
												className="text-sm font-medium leading-none"
											>
												Name
											</label>
											<div className="relative">
												<User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="name"
													placeholder="Jane Doe"
													className="pl-9"
													aria-invalid={field.state.meta.errors.length > 0}
												/>
											</div>
											<FieldError errors={field.state.meta.errors} />
										</div>
									)}
								</form.Field>

								<form.Field name="email">
									{(field) => (
										<div className="space-y-2">
											<label
												htmlFor={field.name}
												className="text-sm font-medium leading-none"
											>
												Email
											</label>
											<div className="relative">
												<Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
												<Input
													id={field.name}
													name={field.name}
													type="email"
													inputMode="email"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="email"
													placeholder="you@example.com"
													className="pl-9"
													aria-invalid={field.state.meta.errors.length > 0}
												/>
											</div>
											<FieldError errors={field.state.meta.errors} />
										</div>
									)}
								</form.Field>

								<form.Field name="password">
									{(field) => (
										<div className="space-y-2">
											<label
												htmlFor={field.name}
												className="text-sm font-medium leading-none"
											>
												Password
											</label>
											<div className="relative">
												<Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
												<Input
													id={field.name}
													name={field.name}
													type={showPassword ? "text" : "password"}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="new-password"
													placeholder="••••••••"
													className="px-9"
													aria-invalid={field.state.meta.errors.length > 0}
												/>
												<button
													type="button"
													onClick={() => setShowPassword((s) => !s)}
													aria-label={
														showPassword ? "Hide password" : "Show password"
													}
													className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
												>
													{showPassword ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</button>
											</div>
											<FieldError errors={field.state.meta.errors} />
										</div>
									)}
								</form.Field>

								<form.Field
									name="confirmPassword"
									validators={{
										onChangeListenTo: ["password"],
										onChange: ({ value, fieldApi }) =>
											value !== fieldApi.form.getFieldValue("password")
												? "Passwords do not match"
												: undefined,
									}}
								>
									{(field) => (
										<div className="space-y-2">
											<label
												htmlFor={field.name}
												className="text-sm font-medium leading-none"
											>
												Confirm password
											</label>
											<div className="relative">
												<Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
												<Input
													id={field.name}
													name={field.name}
													type={showPassword ? "text" : "password"}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoComplete="new-password"
													placeholder="••••••••"
													className="px-9"
													aria-invalid={field.state.meta.errors.length > 0}
												/>
											</div>
											<FieldError errors={field.state.meta.errors} />
										</div>
									)}
								</form.Field>

								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<Button
											type="submit"
											size="lg"
											className="w-full"
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<Loader2 className="animate-spin" />
													Creating account…
												</>
											) : (
												<>
													Create account
													<ArrowRight />
												</>
											)}
										</Button>
									)}
								</form.Subscribe>

								{error && (
									<p className="text-center text-sm text-destructive">
										{error}
									</p>
								)}
							</form>

							<p className="mt-6 text-center text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									to="/login"
									className="font-medium text-primary hover:underline"
								>
									Sign in
								</Link>
							</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

function FieldError({ errors }: { errors: unknown[] }) {
	if (errors.length === 0) return null;
	return (
		<p className="text-sm text-destructive">
			{errors.map((err) => String(err)).join(". ")}
		</p>
	);
}
