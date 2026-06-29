import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { brandNameSchema, updateBrandSchema } from "@/features/brands/schemas";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

function isUniqueConstraintError(error: unknown): boolean {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code: string }).code === "P2002"
	);
}

export const getBrands = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return prisma.brand.findMany({
			where: {
				OR: [{ userId: null }, { userId: context.session.user.id }],
			},
			orderBy: { name: "asc" },
			include: { _count: { select: { assets: true } } },
		});
	});

export const createBrand = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => v.parse(brandNameSchema, input))
	.handler(async ({ context, data }) => {
		try {
			return await prisma.brand.create({
				data: {
					name: data.name,
					domain: data.domain ?? null,
					userId: context.session.user.id,
				},
			});
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new Error(`A brand named "${data.name}" already exists`);
			}
			throw error;
		}
	});

export const updateBrand = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => v.parse(updateBrandSchema, input))
	.handler(async ({ context, data }) => {
		const existing = await prisma.brand.findUnique({
			where: { id: data.id },
		});

		if (!existing) {
			throw new Error("Brand not found");
		}

		if (existing.userId === null) {
			throw new Error("Global brands cannot be modified");
		}

		if (existing.userId !== context.session.user.id) {
			throw new Error("You do not have permission to modify this brand");
		}

		try {
			return await prisma.brand.update({
				where: { id: data.id },
				data: {
					name: data.name,
					domain: data.domain ?? null,
				},
			});
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new Error(`A brand named "${data.name}" already exists`);
			}
			throw error;
		}
	});

export const deleteBrand = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(v.parser(v.object({ id: v.number() })))
	.handler(async ({ context, data }) => {
		const existing = await prisma.brand.findUnique({
			where: { id: data.id },
		});

		if (!existing) {
			throw new Error("Brand not found");
		}

		if (existing.userId === null) {
			throw new Error("Global brands cannot be deleted");
		}

		if (existing.userId !== context.session.user.id) {
			throw new Error("You do not have permission to delete this brand");
		}

		return prisma.brand.delete({ where: { id: data.id } });
	});
