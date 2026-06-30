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

export const updateAsset = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => {
		const parsed = v.parse(assetSchema, input);
		if (parsed.id === undefined) throw new Error("id is required");
		return parsed as typeof parsed & { id: number };
	})
	.handler(async ({ context, data }) => {
		const { id, purchaseDate, warrantyExpiry, ...rest } = data;
		return prisma.asset.update({
			where: { id, ownerId: context.session.user.id },
			data: {
				...rest,
				purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
				warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
			},
			include: { category: true, brand: true },
		});
	});

export const deleteAsset = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(v.object({ assetId: v.number() }))
	.handler(async ({ context, data }) => {
		return prisma.asset.delete({
			where: { id: data.assetId, ownerId: context.session.user.id },
		});
	});
