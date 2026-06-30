import { createServerFn } from "@tanstack/react-start";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

export const getDashboardData = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const ownerId = context.session.user.id;

		const [assets, recentHistory] = await Promise.all([
			prisma.asset.findMany({
				where: { ownerId },
				orderBy: { purchasePrice: "desc" },
				include: { category: true, brand: true },
			}),
			prisma.assetHistory.findMany({
				where: { asset: { ownerId } },
				orderBy: { createdAt: "desc" },
				take: 10,
				include: { asset: { select: { id: true, name: true } } },
			}),
		]);

		const now = new Date();
		const in30 = new Date(now.getTime() + 30 * 86_400_000);
		const in90 = new Date(now.getTime() + 90 * 86_400_000);

		const portfolioByCurrency: Record<string, number> = {};
		const categoryMap = new Map<
			string,
			{ name: string; value: number; count: number; currency: string }
		>();
		const conditionCounts: Record<string, number> = {
			new: 0,
			used: 0,
			refurbished: 0,
		};
		const warrantyItems: {
			id: number;
			name: string;
			category: string;
			expiryDate: string;
			daysRemaining: number;
			status: "expired" | "urgent" | "warning" | "ok";
		}[] = [];

		let warrantyUrgent = 0;
		let warrantySoon = 0;

		for (const asset of assets) {
			portfolioByCurrency[asset.currency] =
				(portfolioByCurrency[asset.currency] || 0) + asset.purchasePrice;

			const catName = asset.category?.name || "Uncategorized";
			const entry = categoryMap.get(catName) || {
				name: catName,
				value: 0,
				count: 0,
				currency: asset.currency,
			};
			entry.value += asset.purchasePrice;
			entry.count++;
			categoryMap.set(catName, entry);

			conditionCounts[asset.condition] =
				(conditionCounts[asset.condition] || 0) + 1;

			if (asset.warrantyExpiry) {
				const exp = new Date(asset.warrantyExpiry);
				let status: "expired" | "urgent" | "warning" | "ok" = "ok";
				const daysRemaining = Math.ceil(
					(exp.getTime() - now.getTime()) / 86_400_000,
				);

				if (exp <= now) {
					status = "expired";
					warrantyUrgent++;
				} else if (exp <= in30) {
					status = "urgent";
					warrantyUrgent++;
				} else if (exp <= in90) {
					status = "warning";
				}

				if (exp <= in90) {
					warrantySoon++;
					warrantyItems.push({
						id: asset.id,
						name: asset.name,
						category: catName,
						expiryDate: asset.warrantyExpiry.toISOString(),
						daysRemaining,
						status,
					});
				}
			}
		}

		warrantyItems.sort((a, b) => a.daysRemaining - b.daysRemaining);

		const primaryCurrency = Object.keys(portfolioByCurrency)[0] || "BDT";
		const portfolioTotal = portfolioByCurrency[primaryCurrency] || 0;
		const mixedCurrencies = Object.keys(portfolioByCurrency).length > 1;

		const categoryData = [...categoryMap.values()].sort(
			(a, b) => b.value - a.value,
		);

		const topAssets = assets.slice(0, 6).map((a) => ({
			id: a.id,
			name: a.name,
			brand: a.brand?.name || null,
			category: a.category?.name || null,
			purchasePrice: a.purchasePrice,
			currency: a.currency,
		}));

		const activityFeed = recentHistory.map((h) => ({
			id: h.id,
			assetId: h.asset.id,
			assetName: h.asset.name,
			action: h.action,
			notes: h.notes,
			createdAt: h.createdAt.toISOString(),
		}));

		return {
			totalAssets: assets.length,
			portfolioTotal,
			primaryCurrency,
			mixedCurrencies,
			currencyCount: Object.keys(portfolioByCurrency).length,
			categoryCount: categoryMap.size,
			warrantyUrgent,
			warrantySoon,
			warrantyItems,
			categoryData,
			topAssets,
			conditionCounts,
			activityFeed,
		};
	});

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
