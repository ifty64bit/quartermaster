import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/logout")({
	server: {
		handlers: {
			GET: async () => {
				const headers = getRequestHeaders();
				await auth.api.signOut({ headers });
				throw redirect({ to: "/" });
			},
		},
	},
});
