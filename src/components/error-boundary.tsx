import type { ErrorComponentProps } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export function RootError({ error, reset }: ErrorComponentProps) {
	const router = useRouter();
	const [reloading, setReloading] = useState(false);

	const handleRetry = async () => {
		setReloading(true);
		reset();
		await router.invalidate();
		setReloading(false);
	};

	return (
		<main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
				<RefreshCw className="size-6" />
			</div>
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Something went wrong
				</h1>
				<p className="max-w-md text-sm text-muted-foreground">
					An unexpected error occurred while rendering this page. You can retry,
					go home, or reach out if it keeps happening.
				</p>
			</div>

			{import.meta.env.DEV && (
				<pre className="max-w-2xl overflow-auto rounded-lg border bg-muted/40 p-4 text-left text-xs text-muted-foreground">
					{error.message}
					{error.stack ? `\n\n${error.stack}` : ""}
				</pre>
			)}

			<div className="flex flex-wrap items-center justify-center gap-3">
				<button
					type="button"
					onClick={handleRetry}
					disabled={reloading}
					className={buttonVariants({ size: "lg" })}
				>
					{reloading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
					{reloading ? "Retrying…" : "Retry"}
				</button>
				<button
					type="button"
					onClick={() => router.navigate({ to: "/" })}
					className={buttonVariants({ variant: "outline", size: "lg" })}
				>
					<Home />
					Go home
				</button>
				<button
					type="button"
					onClick={() => window.history.back()}
					className={buttonVariants({ variant: "ghost", size: "lg" })}
				>
					<ArrowLeft />
					Go back
				</button>
			</div>
		</main>
	);
}
