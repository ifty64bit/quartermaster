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
	.handler(async () => {
		return prisma.category.findMany({
			orderBy: { name: "asc" },
			include: { _count: { select: { assets: true } } },
		});
	});

export const createCategory = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input) => v.parse(categoryNameSchema, input))
	.handler(async ({ data }) => {
		try {
			return await prisma.category.create({ data: { name: data.name } });
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
	.handler(async ({ data }) => {
		try {
			return await prisma.category.update({
				where: { id: data.id },
				data: { name: data.name },
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
	.handler(async ({ data }) => {
		return prisma.category.delete({ where: { id: data.id } });
	});
