import { PackageCheck, ShieldCheck, Sparkles } from "lucide-react";

const FEATURES = [
	"Warranty expiry alerts before they lapse",
	"Net worth & depreciation at a glance",
	"Receipts and documents attached to each asset",
];

export function AuthBrandPanel() {
	return (
		<section className="relative isolate hidden w-1/2 overflow-hidden lg:flex flex-col justify-between p-10 text-white">
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
			<div
				className="absolute inset-0 -z-10 opacity-30"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 20%, oklch(0.6 0.18 250) 0, transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.6 0.18 270) 0, transparent 45%)",
				}}
			/>
			<div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
				<PackageCheck className="size-6" />
				Quartermaster
			</div>

			<div className="max-w-md space-y-6">
				<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
					<Sparkles className="size-3.5" />
					Your inventory, organized
				</div>
				<h1 className="text-4xl font-bold leading-tight tracking-tight">
					Everything you own,
					<br />
					one quiet ledger.
				</h1>
				<p className="text-sm text-white/70">
					Track PCs, cameras, furniture, and components — purchase price,
					warranty status, depreciation, and maintenance history in a single
					place.
				</p>

				<ul className="space-y-3 pt-2 text-sm text-white/80">
					{FEATURES.map((item) => (
						<li key={item} className="flex items-start gap-2.5">
							<ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" />
							{item}
						</li>
					))}
				</ul>
			</div>

			<p className="text-xs text-white/50">
				© {new Date().getFullYear()} Quartermaster · Personal asset management
			</p>
		</section>
	);
}
