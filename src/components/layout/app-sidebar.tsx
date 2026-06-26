import { Link, useLocation } from "@tanstack/react-router";
import {
	FolderTree,
	LayoutDashboard,
	LogOut,
	type LucideIcon,
	MapPin,
	Package,
	PackageCheck,
	Paperclip,
	Search,
	TrendingDown,
	Wrench,
} from "lucide-react";
import type * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { useSignOut } from "@/features/auth/use-sign-out";
import { cn } from "@/lib/utils";

interface SidebarUser {
	name?: string | null;
	email?: string | null;
	image?: string | null;
}

interface NavItem {
	label: string;
	icon: LucideIcon;
	to: string;
	activeWhen: string;
}

const PRIMARY_NAV: NavItem[] = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		to: "/dashboard",
		activeWhen: "/dashboard",
	},
	{ label: "Assets", icon: Package, to: "/dashboard", activeWhen: "/assets" },
	{
		label: "Categories",
		icon: FolderTree,
		to: "/dashboard",
		activeWhen: "/categories",
	},
	{
		label: "Locations",
		icon: MapPin,
		to: "/dashboard",
		activeWhen: "/locations",
	},
];

const SECONDARY_NAV: NavItem[] = [
	{
		label: "Maintenance",
		icon: Wrench,
		to: "/dashboard",
		activeWhen: "/maintenance",
	},
	{
		label: "Depreciation",
		icon: TrendingDown,
		to: "/dashboard",
		activeWhen: "/depreciation",
	},
	{
		label: "Attachments",
		icon: Paperclip,
		to: "/dashboard",
		activeWhen: "/attachments",
	},
	{ label: "Search", icon: Search, to: "/dashboard", activeWhen: "/search" },
];

interface AppSidebarProps {
	user?: SidebarUser | null;
	brandTrailing?: React.ReactNode;
	onNavigate?: () => void;
}

export function AppSidebar({
	user,
	brandTrailing,
	onNavigate,
}: AppSidebarProps) {
	return (
		<div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
			<Brand trailing={brandTrailing} />
			<nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
				<NavSection
					heading="Manage"
					items={PRIMARY_NAV}
					onNavigate={onNavigate}
				/>
				<NavSection
					heading="Track & find"
					items={SECONDARY_NAV}
					onNavigate={onNavigate}
				/>
			</nav>
			<UserFooter user={user} onNavigate={onNavigate} />
		</div>
	);
}

function Brand({ trailing }: { trailing?: React.ReactNode }) {
	return (
		<div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-5">
			<Link
				to="/dashboard"
				className="flex items-center gap-2.5 font-semibold tracking-tight"
			>
				<PackageCheck className="size-5 text-sidebar-primary" />
				<span className="text-[15px]">Quartermaster</span>
			</Link>
			{trailing && <div className="ml-auto">{trailing}</div>}
		</div>
	);
}

function NavSection({
	heading,
	items,
	onNavigate,
}: {
	heading: string;
	items: NavItem[];
	onNavigate?: () => void;
}) {
	return (
		<div className="flex flex-col gap-1">
			<p className="px-3 pb-1 text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
				{heading}
			</p>
			{items.map((item) => (
				<NavLink key={item.label} item={item} onNavigate={onNavigate} />
			))}
		</div>
	);
}

function NavLink({
	item,
	onNavigate,
}: {
	item: NavItem;
	onNavigate?: () => void;
}) {
	const { pathname } = useLocation();
	const isActive =
		pathname === item.activeWhen || pathname.startsWith(`${item.activeWhen}/`);
	const Icon = item.icon;

	return (
		<Link
			to={item.to}
			onClick={onNavigate}
			aria-current={isActive ? "page" : undefined}
			className={cn(
				"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
				isActive
					? "bg-sidebar-accent text-sidebar-accent-foreground"
					: "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
			)}
		>
			<Icon className="size-4 shrink-0" />
			<span>{item.label}</span>
		</Link>
	);
}

function UserFooter({
	user,
	onNavigate,
}: {
	user?: SidebarUser | null;
	onNavigate?: () => void;
}) {
	const signOut = useSignOut();
	const name = user?.name ?? "Account";
	const email = user?.email ?? "";
	const initials = (
		name
			.split(" ")
			.map((part) => part[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("") || "?"
	).toUpperCase();

	return (
		<div className="shrink-0 border-t border-sidebar-border p-3">
			<div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
				<Avatar image={user?.image} initials={initials} name={name} />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">{name}</p>
					{email && (
						<p className="truncate text-xs text-muted-foreground">{email}</p>
					)}
				</div>
				<button
					type="button"
					aria-label="Sign out"
					onClick={() => {
						onNavigate?.();
						void signOut();
					}}
					className={cn(
						buttonVariants({ variant: "ghost", size: "icon" }),
						"size-8 text-muted-foreground hover:text-foreground",
					)}
				>
					<LogOut className="size-4" />
				</button>
			</div>
		</div>
	);
}

function Avatar({
	image,
	initials,
	name,
}: {
	image?: string | null;
	initials: string;
	name: string;
}) {
	if (image) {
		return (
			<img
				src={image}
				alt={name}
				className="size-9 shrink-0 rounded-full object-cover"
				decoding="async"
			/>
		);
	}
	return (
		<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
			{initials}
		</span>
	);
}
