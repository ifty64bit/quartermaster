import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

export const getBrands = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async () => {
		return prisma.brand.findMany({
			orderBy: { name: "asc" },
		});
	});
