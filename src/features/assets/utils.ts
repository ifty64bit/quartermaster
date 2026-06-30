import type { Asset } from "@/features/assets/types";

export const ISO_CURRENCIES: string[] = [
	"AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
	"BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
	"BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
	"COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
	"ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD",
	"GNF", "GTQ", "GYD", "HKD", "HNL", "HTG", "HUF", "IDR", "ILS", "INR",
	"IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF",
	"KPW", "KRW", "KWD", "KZT", "LAK", "LBP", "LKR", "LYD", "MAD", "MDL",
	"MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN",
	"MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB",
	"PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB",
	"RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS",
	"SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TRY",
	"TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND",
	"VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL",
];

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
