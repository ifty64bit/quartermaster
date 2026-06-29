import { queryOptions } from "@tanstack/react-query";
import { getAssets } from "@/server/queries/assets";

export const getDashboardOptions = () =>
	queryOptions({
		queryKey: ["dashboard"],
		queryFn: () => getAssets(),
	});
