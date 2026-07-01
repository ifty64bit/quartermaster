import * as v from "valibot";
import { ISO_CURRENCIES } from "@/features/assets/utils";

export const currencySettingsSchema = v.object({
    currency: v.pipe(
        v.string(),
        v.picklist(ISO_CURRENCIES, "Invalid currency code"),
    ),
});
