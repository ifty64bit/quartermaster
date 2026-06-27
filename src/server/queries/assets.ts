import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { assetSchema } from "@/features/assets/schemas";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

export const getAssets = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return prisma.asset.findMany({
			where: { ownerId: context.session.user.id },
			orderBy: { createdAt: "desc" },
			include: { category: true, brand: true },
		});
	});

export const addAsset = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => v.parse(assetSchema, input))
	.handler(async ({ context, data }) => {
		return prisma.asset.create({
			data: {
				name: data.name,
				purchasePrice: data.purchasePrice,
				currency: data.currency ?? "BDT",
				categoryId: data.categoryId,
				brandId: data.brandId,
				model: data.model,
				serial: data.serial,
				store: data.store,
				productUrl: data.productUrl,
				condition: data.condition ?? "new",
				warrantyExpiry: data.warrantyExpiry,
				notes: data.notes,
				ownerId: context.session.user.id,
			},
		});
	});
