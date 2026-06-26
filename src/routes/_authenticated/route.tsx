import { Dialog } from "@base-ui/react/dialog";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { authClient } from "@/lib/auth-client";
import { authMiddleware } from "@/server/middleware/auth-middleware";

export const Route = createFileRoute("/_authenticated")({
	server: {
		middleware: [authMiddleware],
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { data: session } = authClient.useSession();
	const [mobileOpen, setMobileOpen] = useState(false);
	const user = session?.user;

	return (
		<div className="min-h-svh bg-background">
			<aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:flex lg:flex-col">
				<AppSidebar user={user} />
			</aside>

			<Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
				<header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:hidden">
					<Dialog.Trigger
						aria-label="Open navigation"
						className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
					>
						<Menu className="size-5" />
					</Dialog.Trigger>
					<span className="font-semibold tracking-tight">Quartermaster</span>
				</header>
				<Dialog.Portal>
					<Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
					<Dialog.Popup className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-[transform,opacity] duration-300 ease-out data-starting-style:-translate-x-full data-starting-style:opacity-0 data-ending-style:-translate-x-full data-ending-style:opacity-0">
						<Dialog.Title className="sr-only">Navigation</Dialog.Title>
						<AppSidebar
							user={user}
							onNavigate={() => setMobileOpen(false)}
							brandTrailing={
								<Dialog.Close
									aria-label="Close navigation"
									className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								>
									<X className="size-4.5" />
								</Dialog.Close>
							}
						/>
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>

			<main className="lg:pl-64">
				<div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
