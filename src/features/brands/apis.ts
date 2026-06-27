import { queryOptions } from "@tanstack/react-query";
import { getBrands } from "@/server/queries/brands";

export const getBrandsOptions = () =>
	queryOptions({
		queryKey: ["brands"],
		queryFn: () => getBrands(),
	});
