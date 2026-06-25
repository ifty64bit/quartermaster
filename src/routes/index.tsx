import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Boxes,
	CircleDollarSign,
	Clock,
	Layers,
	LineChart,
	PackageCheck,
	Receipt,
	ShieldCheck,
	Sparkles,
	Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({ component: LandingPage });

const FEATURES = [
	{
		icon: PackageCheck,
		title: "Asset registry",
		description:
			"Log every PC, component, camera, and furniture item with serials, photos, and purchase details in under two minutes.",
	},
	{
		icon: ShieldCheck,
		title: "Warranty tracking",
		description:
			"Know what's under warranty and get alerts before — not after — coverage expires.",
	},
	{
		icon: LineChart,
		title: "Depreciation & net worth",
		description:
			"See current estimated value vs. purchase price across your whole inventory at a glance.",
	},
	{
		icon: Layers,
		title: "Smart categories",
		description:
			"Custom categories with icons and parent hierarchies keep thousands of items findable.",
	},
	{
		icon: Receipt,
		title: "Receipts & documents",
		description:
			"Attach invoices, manuals, and warranty PDFs to each asset so claims are one click away.",
	},
	{
		icon: Wrench,
		title: "Maintenance log",
		description:
			"Record repairs, costs, and recurring service schedules for the gear that matters.",
	},
];

const STEPS = [
	{
		step: "01",
		title: "Add an asset",
		description: "Snap a photo, paste a receipt URL, or type the details.",
	},
	{
		step: "02",
		title: "Let it track",
		description:
			"Quartermaster handles depreciation, warranty countdowns, and reminders.",
	},
	{
		step: "03",
		title: "Stay informed",
		description:
			"Dashboard surfaces net worth, expiring warranties, and what needs attention.",
	},
];

function LandingPage() {
	const { data: session, isPending } = authClient.useSession();
	const isAuthed = !isPending && !!session?.user;

	return (
		<div className="flex min-h-svh flex-col bg-background">
			<SiteHeader isAuthed={isAuthed} />
			<main className="flex-1">
				<Hero isAuthed={isAuthed} />
				<Stats />
				<Features />
				<HowItWorks />
				<ClosingCta isAuthed={isAuthed} />
			</main>
			<SiteFooter />
		</div>
	);
}

function SiteHeader({ isAuthed }: { isAuthed: boolean }) {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<Link
					to="/"
					className="flex items-center gap-2 font-semibold tracking-tight"
				>
					<PackageCheck className="size-6" />
					<span className="text-lg">Quartermaster</span>
				</Link>
				<nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
					<a
						href="#features"
						className="hover:text-foreground transition-colors"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="hover:text-foreground transition-colors"
					>
						How it works
					</a>
				</nav>
				<div className="flex items-center gap-2">
					{isAuthed ? (
						<Link
							to="/dashboard"
							className={buttonVariants({ variant: "ghost", size: "sm" })}
						>
							Dashboard
						</Link>
					) : (
						<Link
							to="/login"
							className={buttonVariants({ variant: "ghost", size: "sm" })}
						>
							Sign in
						</Link>
					)}
					{!isAuthed && (
						<Link to="/signup" className={buttonVariants({ size: "sm" })}>
							Get started
							<ArrowRight />
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}

function Hero({ isAuthed }: { isAuthed: boolean }) {
	return (
		<section className="relative overflow-hidden border-b">
			<div
				className="pointer-events-none absolute inset-0 -z-10 opacity-60"
				style={{
					backgroundImage:
						"radial-gradient(60rem 30rem at 50% -10%, color-mix(in oklch, var(--primary) 8%, transparent) 0, transparent 70%)",
				}}
			/>
			<div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
				<div className="mx-auto max-w-3xl text-center">
					<div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
						<Sparkles className="size-3.5" />
						Personal asset management
					</div>
					<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
						Everything you own,
						<br className="hidden sm:block" />
						<span className="text-muted-foreground"> one quiet ledger.</span>
					</h1>
					<p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
						Track PCs, cameras, furniture, and components — purchase price,
						warranty status, depreciation, and maintenance history in a single
						place.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						{isAuthed ? (
							<Link to="/dashboard" className={buttonVariants({ size: "lg" })}>
								Go to dashboard
								<ArrowRight />
							</Link>
						) : (
							<>
								<Link to="/signup" className={buttonVariants({ size: "lg" })}>
									Start tracking free
									<ArrowRight />
								</Link>
								<Link
									to="/login"
									className={buttonVariants({ size: "lg", variant: "outline" })}
								>
									Sign in
								</Link>
							</>
						)}
					</div>
					<p className="mt-4 text-xs text-muted-foreground">
						No credit card. Your inventory stays yours.
					</p>
				</div>

				<HeroPreview />
			</div>
		</section>
	);
}

function HeroPreview() {
	return (
		<div className="mt-16 overflow-hidden rounded-xl border bg-card shadow-2xl">
			<div className="flex items-center gap-1.5 border-b px-4 py-3">
				<span className="size-3 rounded-full bg-destructive/40" />
				<span className="size-3 rounded-full bg-amber-400/50" />
				<span className="size-3 rounded-full bg-emerald-400/50" />
				<span className="ml-3 text-xs text-muted-foreground">
					quartermaster / dashboard
				</span>
			</div>
			<div className="grid gap-4 p-6 sm:grid-cols-3">
				{[
					{ icon: Boxes, label: "Total assets", value: "248" },
					{ icon: CircleDollarSign, label: "Net value", value: "$42,180" },
					{ icon: Clock, label: "Warranties expiring", value: "7" },
				].map((metric) => (
					<div
						key={metric.label}
						className="rounded-lg border bg-background p-4"
					>
						<metric.icon className="size-5 text-muted-foreground" />
						<div className="mt-3 text-2xl font-semibold">{metric.value}</div>
						<div className="text-sm text-muted-foreground">{metric.label}</div>
					</div>
				))}
			</div>
			<div className="grid gap-3 border-t px-6 py-4 sm:grid-cols-2">
				{[
					{ name: "Main Desktop PC", value: "$2,400 · Warranty active" },
					{ name: "Sony A7 IV", value: "$2,198 · Warranty expiring" },
					{ name: "Herman Miller Embody", value: "$1,495 · No warranty" },
					{ name: "RTX 4090 FE", value: "$1,599 · Warranty active" },
				].map((row) => (
					<div
						key={row.name}
						className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-sm"
					>
						<span className="font-medium">{row.name}</span>
						<span className="text-muted-foreground">{row.value}</span>
					</div>
				))}
			</div>
		</div>
	);
}

function Stats() {
	return (
		<section className="border-b">
			<div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:grid-cols-4">
				{[
					{ value: "< 2 min", label: "To add a new asset" },
					{ value: "100%", label: "Of what you own, in one place" },
					{ value: "30/60/90", label: "Day warranty alerts" },
					{ value: "0", label: "Spreadsheets required" },
				].map((stat) => (
					<div key={stat.label} className="text-center">
						<div className="text-3xl font-bold tracking-tight">
							{stat.value}
						</div>
						<div className="mt-1 text-sm text-muted-foreground">
							{stat.label}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function Features() {
	return (
		<section id="features" className="border-b">
			<div className="mx-auto max-w-6xl px-6 py-20">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Built for the way you actually own things
					</h2>
					<p className="mt-3 text-muted-foreground">
						From single peripherals to multi-thousand-dollar kits, Quartermaster
						keeps the full lifecycle organized.
					</p>
				</div>
				<div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{FEATURES.map((feature) => (
						<div
							key={feature.title}
							className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
						>
							<div className="flex size-11 items-center justify-center rounded-lg bg-muted">
								<feature.icon className="size-5 text-foreground" />
							</div>
							<h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function HowItWorks() {
	return (
		<section id="how-it-works" className="border-b bg-muted/30">
			<div className="mx-auto max-w-6xl px-6 py-20">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Three steps to a catalogued life
					</h2>
					<p className="mt-3 text-muted-foreground">
						Get started in an evening. Stay current forever.
					</p>
				</div>
				<div className="mt-14 grid gap-8 md:grid-cols-3">
					{STEPS.map((step) => (
						<div
							key={step.step}
							className="relative rounded-xl border bg-card p-6"
						>
							<span className="text-5xl font-bold text-muted-foreground/20">
								{step.step}
							</span>
							<h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								{step.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function ClosingCta({ isAuthed }: { isAuthed: boolean }) {
	return (
		<section className="border-b">
			<div className="mx-auto max-w-4xl px-6 py-20">
				<div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-primary-foreground shadow-xl sm:p-16">
					<div
						className="pointer-events-none absolute inset-0 opacity-30"
						style={{
							backgroundImage:
								"radial-gradient(circle at 20% 30%, oklch(0.6 0.18 250) 0, transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.6 0.18 270) 0, transparent 45%)",
						}}
					/>
					<Layers className="mx-auto size-10" />
					<h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
						Stop guessing. Start cataloguing.
					</h2>
					<p className="mx-auto mt-3 max-w-md text-sm text-white/70">
						Join the inventory you actually trust. Build your full asset list
						today.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						{isAuthed ? (
							<Link
								to="/dashboard"
								className={buttonVariants({ size: "lg", variant: "secondary" })}
							>
								Open dashboard
								<ArrowRight />
							</Link>
						) : (
							<Link
								to="/signup"
								className={buttonVariants({ size: "lg", variant: "secondary" })}
							>
								Create your free account
								<ArrowRight />
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function SiteFooter() {
	return (
		<footer className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-muted-foreground">
			<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div className="flex items-center gap-2">
					<PackageCheck className="size-5" />
					<span className="font-medium text-foreground">Quartermaster</span>
				</div>
				<nav className="flex items-center gap-6">
					<a
						href="#features"
						className="hover:text-foreground transition-colors"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="hover:text-foreground transition-colors"
					>
						How it works
					</a>
					<Link to="/login" className="hover:text-foreground transition-colors">
						Sign in
					</Link>
				</nav>
				<p className="text-xs">
					© {new Date().getFullYear()} Quartermaster · Personal asset management
				</p>
			</div>
		</footer>
	);
}
