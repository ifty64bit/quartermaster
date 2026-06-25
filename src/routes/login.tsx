import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	PackageCheck,
} from "lucide-react";
import type { SubmitEvent } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitting(true);
		window.setTimeout(() => setSubmitting(false), 900);
	};

	async function handleSocialLogin(
		provider: "google" | "github" | "microsoft",
	) {
		setError(null);
		const { error: signInError } = await authClient.signIn.social({
			provider,
			callbackURL: "/dashboard",
		});
		if (signInError) {
			setError(signInError.message ?? "Unable to sign in. Please try again.");
		}
	}

	return (
		<main className="relative flex min-h-svh items-stretch bg-background">
			<AuthBrandPanel />

			{/* Form panel */}
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
							<CardTitle className="text-2xl">Welcome back</CardTitle>
							<CardDescription>
								Sign in to your account to continue
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="text-sm font-medium leading-none"
									>
										Email
									</label>
									<div className="relative">
										<Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="email"
											type="email"
											inputMode="email"
											autoComplete="email"
											placeholder="you@example.com"
											required
											className="pl-9"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<label
											htmlFor="password"
											className="text-sm font-medium leading-none"
										>
											Password
										</label>
										<Link
											to="/login"
											className="text-xs font-medium text-primary hover:underline"
										>
											Forgot password?
										</Link>
									</div>
									<div className="relative">
										<Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											autoComplete="current-password"
											placeholder="••••••••"
											required
											className="px-9"
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
								</div>

								<label
									htmlFor="remember"
									className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none"
								>
									<Checkbox
										id="remember"
										checked={remember}
										onCheckedChange={setRemember}
									/>
									Remember me for 30 days
								</label>

								<Button
									type="submit"
									size="lg"
									className="w-full"
									disabled={submitting}
								>
									{submitting ? (
										<>
											<Loader2 className="animate-spin" />
											Signing in…
										</>
									) : (
										<>
											Sign in
											<ArrowRight />
										</>
									)}
								</Button>
							</form>

							<div className="my-6 flex items-center gap-3">
								<div className="h-px flex-1 bg-border" />
								<span className="text-xs text-muted-foreground">OR</span>
								<div className="h-px flex-1 bg-border" />
							</div>
							<Button
								variant="outline"
								size="lg"
								className="w-full"
								onClick={() => handleSocialLogin("google")}
							>
								<GoogleIcon className="size-4" />
								Continue with Google
							</Button>
							{error && (
								<p className="text-center text-sm text-destructive">{error}</p>
							)}

							<p className="mt-6 text-center text-sm text-muted-foreground">
								Don&apos;t have an account?{" "}
								<Link
									to="/signup"
									className="font-medium text-primary hover:underline"
								>
									Sign up
								</Link>
							</p>
						</CardContent>
					</Card>

					<p className="mt-6 text-center text-xs text-muted-foreground">
						By signing in you agree to our{" "}
						<span className="cursor-pointer hover:underline decoration-muted-foreground">
							Terms
						</span>{" "}
						and{" "}
						<span className="cursor-pointer hover:underline decoration-muted-foreground">
							Privacy Policy
						</span>
						.
					</p>
				</div>
			</section>
		</main>
	);
}

function GoogleIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={className} aria-hidden="true">
			<title>Google</title>
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11.5 11.5 0 0 0 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.09a6.93 6.93 0 0 1 0-4.18V7.07H2.18a11.5 11.5 0 0 0 0 10.86l3.66-2.84z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
			/>
		</svg>
	);
}
