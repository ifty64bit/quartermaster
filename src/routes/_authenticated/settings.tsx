import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type CurrencyCode, ISO_CURRENCIES } from "@/features/assets/utils";
import {
    getUserSettingsOptions,
    useUpdateUserCurrency,
} from "@/features/settings/apis";

export const Route = createFileRoute("/_authenticated/settings")({
    loader: async ({ context }) => {
        await context.queryClient.ensureQueryData(getUserSettingsOptions());
    },
    component: SettingsPage,
});

function SettingsPage() {
    const { data: userSettings } = useSuspenseQuery(getUserSettingsOptions());
    const [currency, setCurrency] = useState(userSettings.currency);
    const [error, setError] = useState<string | null>(null);

    const updateCurrency = useUpdateUserCurrency();

    const isDirty = currency !== userSettings.currency;

    const currencyItems = ISO_CURRENCIES.map((code) => ({
        label: code,
        value: code as CurrencyCode,
    }));

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Customize your Quartermaster experience
                </p>
            </header>

            <section className="flex flex-col gap-6 rounded-xl border p-6">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Settings className="size-5 text-foreground" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Default currency</h2>
                        <p className="text-sm text-muted-foreground">
                            Choose the currency used for your asset values and
                            dashboard summaries.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex w-full max-w-xs flex-col gap-1.5">
                        <label
                            htmlFor="settings-currency"
                            className="text-sm font-medium"
                        >
                            Currency
                        </label>
                        <Select
                            value={currency}
                            onValueChange={(value) => {
                                setCurrency(value as CurrencyCode);
                                if (error) setError(null);
                            }}
                            items={currencyItems}
                        >
                            <SelectTrigger
                                id="settings-currency"
                                aria-invalid={!!error}
                            >
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {currencyItems.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}
                    </div>
                    <Button
                        onClick={() => updateCurrency.mutate(currency)}
                        disabled={!isDirty || updateCurrency.isPending}
                    >
                        {updateCurrency.isPending && (
                            <Loader2 className="animate-spin" />
                        )}
                        Save
                    </Button>
                </div>
            </section>
        </div>
    );
}
