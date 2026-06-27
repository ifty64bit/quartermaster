import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { addAsset, getAssets } from "@/server/queries/assets";
import type { CreateAssetValues } from "./schemas";

export const getAssetsOptions = () =>
	queryOptions({
		queryKey: ["assets"],
		queryFn: () => getAssets(),
	});

export function useAddAsset() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["addAsset"],
		mutationFn: async (data: CreateAssetValues) => addAsset({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getAssetsOptions().queryKey });
		},
	});
}
