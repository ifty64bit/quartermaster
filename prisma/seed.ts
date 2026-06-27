import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaLibSql({
	url: process.env.TURSO_DATABASE_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = [
	"PC",
	"PC Component",
	"Peripheral",
	"Laptop",
	"Mobile Device",
	"Tablet",
	"Wearable",
	"Camera",
	"Lens",
	"Audio",
	"Gaming",
	"Display",
	"Network",
	"Storage",
	"Software License",
	"Furniture",
	"Appliance",
	"Kitchen",
	"Tool",
	"Bicycle",
	"Musical Instrument",
	"Book",
	"Collectible",
	"Other",
];

const DEFAULT_BRANDS = [
	"Apple",
	"Samsung",
	"Google",
	"Microsoft",
	"Sony",
	"LG",
	"Dell",
	"HP",
	"Lenovo",
	"ASUS",
	"Acer",
	"MSI",
	"NVIDIA",
	"AMD",
	"Intel",
	"Gigabyte",
	"Corsair",
	"NZXT",
	"Cooler Master",
	"Logitech",
	"Razer",
	"SteelSeries",
	"HyperX",
	"Keychron",
	"Canon",
	"Nikon",
	"Fujifilm",
	"Panasonic",
	"Bose",
	"Sennheiser",
	"JBL",
	"Audio-Technica",
	"Garmin",
	"Fitbit",
	"OnePlus",
	"Xiaomi",
	"TP-Link",
	"Netgear",
	"Ubiquiti",
	"WD",
	"Seagate",
	"Crucial",
	"IKEA",
	"Herman Miller",
	"Steelcase",
	"Dyson",
	"Philips",
	"Bosch",
	"KitchenAid",
	"Adobe",
	"JetBrains",
	"Nintendo",
	"Valve",
	"BenQ",
	"ViewSonic",
	"Wacom",
	"EVGA",
	"Autonomous",
];

async function main() {
	console.log("🌱 Seeding default categories...");

	for (const name of DEFAULT_CATEGORIES) {
		await prisma.category.upsert({
			where: { name },
			update: {},
			create: { name },
		});
	}

	console.log(`✅ Seeded ${DEFAULT_CATEGORIES.length} categories`);

	console.log("🌱 Seeding default brands...");

	for (const name of DEFAULT_BRANDS) {
		await prisma.brand.upsert({
			where: { name },
			update: {},
			create: { name },
		});
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
