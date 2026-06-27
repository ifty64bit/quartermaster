import type { Prisma } from "../../../generated/prisma/client";

export type AssetCondition = "new" | "used" | "refurbished";

export interface Category {
	id: number;
	name: string;
}

export interface Brand {
	id: number;
	name: string;
}

export type Asset = Prisma.AssetGetPayload<{
	include: { category: true; brand: true };
}>;
