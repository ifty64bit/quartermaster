import type { Prisma } from "../../../generated/prisma/client";

export type Category = Prisma.CategoryGetPayload<undefined>;

export type Brand = Prisma.BrandGetPayload<undefined>;

export type Asset = Prisma.AssetGetPayload<{
	include: { category: true; brand: true };
}>;

export type AssetCondition = Asset["condition"];
