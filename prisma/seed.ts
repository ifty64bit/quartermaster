import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaLibSql({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = [
	{ name: "PC", icon: "🖥️" },
	{ name: "PC Component", icon: "🔌" },
	{ name: "Peripheral", icon: "⌨️" },
	{ name: "Laptop", icon: "💻" },
	{ name: "Mobile Device", icon: "📱" },
	{ name: "Tablet", icon: "📟" },
	{ name: "Wearable", icon: "⌚" },
	{ name: "Camera", icon: "📷" },
	{ name: "Lens", icon: "🔍" },
	{ name: "Audio", icon: "🎧" },
	{ name: "Gaming", icon: "🎮" },
	{ name: "Display", icon: "🖥️" },
	{ name: "Network", icon: "🌐" },
	{ name: "Storage", icon: "💾" },
	{ name: "Software License", icon: "🔑" },
	{ name: "Furniture", icon: "🪑" },
	{ name: "Appliance", icon: "🔌" },
	{ name: "Kitchen", icon: "🍳" },
	{ name: "Tool", icon: "🛠️" },
	{ name: "Bicycle", icon: "🚲" },
	{ name: "Musical Instrument", icon: "🎸" },
	{ name: "Book", icon: "📚" },
	{ name: "Collectible", icon: "🏆" },
	{ name: "Other", icon: "📦" },
];

const DEFAULT_BRANDS = [
	{ name: "Apple", domain: "apple.com" },
	{ name: "Samsung", domain: "samsung.com" },
	{ name: "Google", domain: "google.com" },
	{ name: "Microsoft", domain: "microsoft.com" },
	{ name: "Sony", domain: "sony.com" },
	{ name: "LG", domain: "lg.com" },
	{ name: "Dell", domain: "dell.com" },
	{ name: "HP", domain: "hp.com" },
	{ name: "Lenovo", domain: "lenovo.com" },
	{ name: "ASUS", domain: "asus.com" },
	{ name: "Acer", domain: "acer.com" },
	{ name: "MSI", domain: "msi.com" },
	{ name: "NVIDIA", domain: "nvidia.com" },
	{ name: "AMD", domain: "amd.com" },
	{ name: "Intel", domain: "intel.com" },
	{ name: "Gigabyte", domain: "gigabyte.com" },
	{ name: "Corsair", domain: "corsair.com" },
	{ name: "NZXT", domain: "nzxt.com" },
	{ name: "Cooler Master", domain: "coolermaster.com" },
	{ name: "Logitech", domain: "logitech.com" },
	{ name: "Razer", domain: "razer.com" },
	{ name: "SteelSeries", domain: "steelseries.com" },
	{ name: "HyperX", domain: "hyperx.com" },
	{ name: "Keychron", domain: "keychron.com" },
	{ name: "Canon", domain: "canon.com" },
	{ name: "Nikon", domain: "nikon.com" },
	{ name: "Fujifilm", domain: "fujifilm.com" },
	{ name: "Panasonic", domain: "panasonic.com" },
	{ name: "Bose", domain: "bose.com" },
	{ name: "Sennheiser", domain: "sennheiser.com" },
	{ name: "JBL", domain: "jbl.com" },
	{ name: "Audio-Technica", domain: "audio-technica.com" },
	{ name: "Garmin", domain: "garmin.com" },
	{ name: "Fitbit", domain: "fitbit.com" },
	{ name: "OnePlus", domain: "oneplus.com" },
	{ name: "Xiaomi", domain: "mi.com" },
	{ name: "TP-Link", domain: "tp-link.com" },
	{ name: "Netgear", domain: "netgear.com" },
	{ name: "Ubiquiti", domain: "ui.com" },
	{ name: "WD", domain: "westerndigital.com" },
	{ name: "Seagate", domain: "seagate.com" },
	{ name: "Crucial", domain: "crucial.com" },
	{ name: "IKEA", domain: "ikea.com" },
	{ name: "Herman Miller", domain: "hermanmiller.com" },
	{ name: "Steelcase", domain: "steelcase.com" },
	{ name: "Dyson", domain: "dyson.com" },
	{ name: "Philips", domain: "philips.com" },
	{ name: "Bosch", domain: "bosch.com" },
	{ name: "KitchenAid", domain: "kitchenaid.com" },
	{ name: "Adobe", domain: "adobe.com" },
	{ name: "JetBrains", domain: "jetbrains.com" },
	{ name: "Nintendo", domain: "nintendo.com" },
	{ name: "Valve", domain: "valvesoftware.com" },
	{ name: "BenQ", domain: "benq.com" },
	{ name: "ViewSonic", domain: "viewsonic.com" },
	{ name: "Wacom", domain: "wacom.com" },
	{ name: "EVGA", domain: "evga.com" },
	{ name: "Autonomous", domain: "autonomous.ai" },
];

async function main() {
	console.log("🌱 Seeding default categories...");

	for (const category of DEFAULT_CATEGORIES) {
		const existing = await prisma.category.findFirst({
			where: { name: category.name, userId: null },
		});
		if (!existing) {
			await prisma.category.create({
				data: { name: category.name, icon: category.icon, userId: null },
			});
		}
	}

	console.log(`✅ Seeded ${DEFAULT_CATEGORIES.length} categories`);

	console.log("🌱 Seeding default brands...");

	for (const brand of DEFAULT_BRANDS) {
		const existing = await prisma.brand.findFirst({
			where: { name: brand.name, userId: null },
		});
		if (!existing) {
			await prisma.brand.create({
				data: { name: brand.name, domain: brand.domain, userId: null },
			});
		}
	}

	console.log(`✅ Seeded ${DEFAULT_BRANDS.length} brands`);
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
