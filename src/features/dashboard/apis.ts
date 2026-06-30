import { queryOptions } from "@tanstack/react-query";
import { getDashboardData } from "@/server/queries/dashboard";

export const getDashboardOptions = () =>
	queryOptions({
		queryKey: ["dashboard"],
		queryFn: () => getDashboardData(),
	});
