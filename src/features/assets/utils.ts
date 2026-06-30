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

export function formatCompact(amount: number): string {
	const abs = Math.abs(amount);
	const sign = amount < 0 ? "-" : "";

	if (abs >= 1_000_000_000) {
		const val = abs / 1_000_000_000;
		return `${sign}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}B`;
	}
	if (abs >= 1_000_000) {
		const val = abs / 1_000_000;
		return `${sign}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
	}
	if (abs >= 1_000) {
		const val = abs / 1_000;
		return `${sign}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`;
	}
	return `${sign}${abs}`;
}

export function formatCompactCurrency(
	amount: number,
	currency: string,
): string {
	return `${currency} ${formatCompact(amount)}`;
}
