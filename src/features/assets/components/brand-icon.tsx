import { Box } from "lucide-react";
import { useState } from "react";
import { getBrandIconUrl } from "@/features/brands/utils";
import type { Asset } from "../types";

function BrandIcon({ asset }: { asset: Asset }) {
	const [failed, setFailed] = useState(false);
	const iconUrl = getBrandIconUrl(asset.brand?.domain);

	if (!iconUrl || failed) {
		return (
			<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
				<Box className="size-5" />
			</div>
		);
	}

	return (
		<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
			<img
				src={iconUrl}
				alt={asset.brand?.name ?? "brand"}
				className="size-6 object-contain"
				onError={() => setFailed(true)}
				loading="lazy"
			/>
		</div>
	);
}
export default BrandIcon;
