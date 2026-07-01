import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import {
	categoryNameSchema,
	updateCategorySchema,
} from "@/features/categories/schemas";
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

export const getCategories = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return prisma.category.findMany({
			where: {
				OR: [{ userId: null }, { userId: context.session.user.id }],
			},
			orderBy: { name: "asc" },
			include: { _count: { select: { assets: true } } },
		});
	});

export const createCategory = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => v.parse(categoryNameSchema, input))
	.handler(async ({ context, data }) => {
		try {
			return await prisma.category.create({
				data: {
					name: data.name,
					icon: data.icon ?? null,
					userId: context.session.user.id,
				},
			});
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new Error(`A category named "${data.name}" already exists`);
			}
			throw error;
		}
	});

export const updateCategory = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => v.parse(updateCategorySchema, input))
	.handler(async ({ context, data }) => {
		try {
			const result = await prisma.category.updateMany({
				where: { id: data.id, userId: context.session.user.id },
				data: { name: data.name, icon: data.icon ?? null },
			});

			if (result.count === 0) {
				throw new Error("Category not found");
			}

			return prisma.category.findUniqueOrThrow({
				where: { id: data.id },
			});
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new Error(`A category named "${data.name}" already exists`);
			}
			throw error;
		}
	});

export const deleteCategory = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(v.parser(v.object({ id: v.number() })))
	.handler(async ({ context, data }) => {
		const result = await prisma.category.deleteMany({
			where: { id: data.id, userId: context.session.user.id },
		});

		if (result.count === 0) {
			throw new Error("Category not found");
		}

		return { success: true };
	});
