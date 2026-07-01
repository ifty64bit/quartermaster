import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { currencySettingsSchema } from "@/features/settings/schemas";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware/auth-middleware";

export const getUserSettings = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        return prisma.userSettings.upsert({
            where: { userId: context.session.user.id },
            update: {},
            create: { userId: context.session.user.id },
        });
    });

export const updateCurrency = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator((input) => v.parse(currencySettingsSchema, input))
    .handler(async ({ context, data }) => {
        return prisma.userSettings.upsert({
            where: { userId: context.session.user.id },
            update: { currency: data.currency },
            create: {
                userId: context.session.user.id,
                currency: data.currency,
            },
        });
    });
