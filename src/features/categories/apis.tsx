import { queryOptions } from "@tanstack/react-query";
import { getCategories } from "@/server/queries/categories";

export const getCategoriesOptions = () =>
	queryOptions({
		queryKey: ["categories"],
		queryFn: () => getCategories(),
	});
