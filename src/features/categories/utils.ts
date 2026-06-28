export function getCategoryIconUrl(
	emoji: string | null | undefined,
): string | null {
	if (!emoji) return null;
	const normalized = emoji.replace(/\ufe0f/g, "");
	const mapping: Record<string, string> = {
		"🖥": "https://fluent-emoji.ciffelia.com/1f5a5-fe0f_3d.webp",
		"🔌": "https://fluent-emoji.ciffelia.com/1f50c_3d.webp",
		"⌨": "https://fluent-emoji.ciffelia.com/2328-fe0f_3d.webp",
		"💻": "https://fluent-emoji.ciffelia.com/1f4bb_3d.webp",
		"📱": "https://fluent-emoji.ciffelia.com/1f4f1_3d.webp",
		"📟": "https://fluent-emoji.ciffelia.com/1f4df_3d.webp",
		"⌚": "https://fluent-emoji.ciffelia.com/231a_3d.webp",
		"📷": "https://fluent-emoji.ciffelia.com/1f4f7_3d.webp",
		"🔍": "https://fluent-emoji.ciffelia.com/1f50d_3d.webp",
		"🎧": "https://fluent-emoji.ciffelia.com/1f3a7_3d.webp",
		"🎮": "https://fluent-emoji.ciffelia.com/1f579-fe0f_3d.webp", // Mapped to 3D Joystick (Video Game Controller is not open source)
		"🌐": "https://fluent-emoji.ciffelia.com/1f310_3d.webp",
		"💾": "https://fluent-emoji.ciffelia.com/1f4be_3d.webp",
		"🔑": "https://fluent-emoji.ciffelia.com/1f511_3d.webp",
		"🪑": "https://fluent-emoji.ciffelia.com/1fa91_3d.webp",
		"🍳": "https://fluent-emoji.ciffelia.com/1f373_3d.webp",
		"🛠": "https://fluent-emoji.ciffelia.com/1f6e0-fe0f_3d.webp",
		"🚲": "https://fluent-emoji.ciffelia.com/1f6b2_3d.webp",
		"🎸": "https://fluent-emoji.ciffelia.com/1f3b8_3d.webp",
		"📚": "https://fluent-emoji.ciffelia.com/1f4da_3d.webp",
		"🏆": "https://fluent-emoji.ciffelia.com/1f3c6_3d.webp",
		"📦": "https://fluent-emoji.ciffelia.com/1f4e6_3d.webp",
	};
	return mapping[normalized] || null;
}
