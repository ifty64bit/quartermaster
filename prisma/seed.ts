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
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
