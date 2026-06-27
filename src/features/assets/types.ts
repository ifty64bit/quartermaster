export type AssetCondition = "new" | "used" | "refurbished";

export interface Category {
	id: number;
	name: string;
}

export interface Brand {
	id: number;
	name: string;
}

export interface Asset {
	id: number;
	name: string;
	model: string | null;
	serial: string | null;
	purchaseDate: string;
	purchasePrice: number;
	currency: string;
	store: string | null;
	productUrl: string | null;
	condition: AssetCondition;
	warrantyExpiry: string | null;
	notes: string | null;
	categoryId: number | null;
	category: Category | null;
	brandId: number | null;
	brand: Brand | null;
	createdAt: string;
	updatedAt: string;
}

export type QuickAddAsset = {
	name: string;
	purchasePrice: number;
	categoryId: number | null;
};

export type AssetFormData = Omit<
	Asset,
	"id" | "createdAt" | "updatedAt" | "category" | "brand"
>;
