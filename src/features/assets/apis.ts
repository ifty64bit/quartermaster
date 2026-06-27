import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { addAsset, getAssets, updateAsset } from "@/server/queries/assets";
import type { AssetFormValues, CreateAssetValues } from "./schemas";

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

export function useUpdateAsset() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["updateAsset"],
		mutationFn: async (data: AssetFormValues) => updateAsset({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getAssetsOptions().queryKey });
		},
	});
}
