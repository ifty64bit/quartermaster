import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SKELETON_KEYS = [
	"skel-1",
	"skel-2",
	"skel-3",
	"skel-4",
	"skel-5",
	"skel-6",
];

function AssetGridSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<header className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
					<p className="text-sm text-muted-foreground">Loading assets…</p>
				</div>
				<div className="flex items-center gap-2">
					<Button disabled>
						<Zap />
						Quick add
					</Button>
					<Button variant="outline" disabled>
						<Plus />
						Add details
					</Button>
				</div>
			</header>

			<div className="relative">
				<div className="h-10 animate-pulse rounded-lg bg-muted/40" />
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{SKELETON_KEYS.map((key) => (
					<div
						key={key}
						className="h-48 animate-pulse rounded-xl border bg-muted/40"
					/>
				))}
			</div>
		</div>
	);
}

export default AssetGridSkeleton;
