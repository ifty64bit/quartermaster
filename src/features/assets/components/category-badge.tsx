import { Box } from "lucide-react";
import { getCategoryIconUrl } from "@/features/categories/utils";

export function CategoryBadge({
	name,
	icon,
}: {
	name: string;
	icon?: string | null;
}) {
	const iconUrl = getCategoryIconUrl(icon);

	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
			{iconUrl ? (
				<img
					src={iconUrl}
					alt=""
					className="size-3.5 shrink-0"
					loading="lazy"
				/>
			) : (
				<Box className="size-3.5 shrink-0 text-muted-foreground" />
			)}
			{name}
		</span>
	);
}
