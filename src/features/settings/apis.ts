import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { getUserSettings, updateCurrency } from "@/server/queries/settings";
import type { CurrencyCode } from "../assets/utils";

type UserSettings = {
	id: number;
	currency: CurrencyCode;
	userId: string;
};

export const getUserSettingsOptions = () =>
	queryOptions({
		queryKey: ["user-settings"],
		queryFn: () => getUserSettings() as Promise<UserSettings>,
	});

export function useUpdateUserCurrency() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["update-user-currency"],
		mutationFn: async (currency: CurrencyCode) =>
			updateCurrency({ data: { currency } }),
		onSuccess: () => {
			queryClient.invalidateQueries(getUserSettingsOptions());
		},
	});
}
