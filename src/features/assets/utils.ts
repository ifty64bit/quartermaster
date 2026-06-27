import type { Asset } from "@/features/assets/types";

const DETAIL_FIELDS: (keyof Asset)[] = [
	"model",
	"serial",
	"store",
	"productUrl",
	"warrantyExpiry",
	"notes",
	"brandId",
];

export function completeness(asset: Asset): number {
	const filled = DETAIL_FIELDS.filter((f) => {
		const value = asset[f];
		return value !== null && value !== "" && value !== undefined;
	}).length;
	return Math.round((filled / DETAIL_FIELDS.length) * 100);
}

export function isComplete(asset: Asset): boolean {
	return completeness(asset) === 100;
}

export function formatCurrency(amount: number, currency: string): string {
	try {
		return new Intl.NumberFormat(undefined, {
			currency,
			style: "currency",
		}).format(amount);
	} catch {
		return `${currency} ${amount.toFixed(2)}`;
	}
}
