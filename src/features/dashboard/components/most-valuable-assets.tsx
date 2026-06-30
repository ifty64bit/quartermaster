import { Link } from "@tanstack/react-router";
import { ArrowRight, Crown } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatCompactCurrency } from "@/features/assets/utils";

interface TopAsset {
	id: number;
	name: string;
	brand: string | null;
	category: string | null;
	purchasePrice: number;
	currency: string;
}

interface MostValuableAssetsProps {
	assets: TopAsset[];
}

export function MostValuableAssets({ assets }: MostValuableAssetsProps) {
	if (assets.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Crown className="size-4.5 text-amber-500" />
						Most Valuable
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="py-6 text-center text-sm text-muted-foreground">
						No assets added yet
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Crown className="size-4.5 text-amber-500" />
					Most Valuable
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-1">
				{assets.map((asset, index) => (
					<Link
						key={asset.id}
						to="/assets"
						className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
					>
						<span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold tabular-nums text-muted-foreground">
							{index + 1}
						</span>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium">{asset.name}</p>
							<p className="truncate text-xs text-muted-foreground">
								{[asset.brand, asset.category].filter(Boolean).join(" · ") ||
									"—"}
							</p>
						</div>
						<span className="shrink-0 text-sm font-semibold tabular-nums">
							{formatCompactCurrency(asset.purchasePrice, asset.currency)}
						</span>
					</Link>
				))}
			</CardContent>
			<CardFooter>
				<Link
					to="/assets"
					className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					View all assets
					<ArrowRight className="size-3.5" />
				</Link>
			</CardFooter>
		</Card>
	);
}
