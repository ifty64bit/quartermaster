function CompletenessTag({ pct }: { pct: number }) {
	if (pct === 100) {
		return (
			<span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
				Complete
			</span>
		);
	}
	return (
		<span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
			{pct}% filled
		</span>
	);
}

export default CompletenessTag;
