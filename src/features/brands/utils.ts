export function getBrandIconUrl(
	domain: string | null | undefined,
): string | null {
	if (!domain) return null;
	return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
