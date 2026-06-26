import { createFileRoute } from "@tanstack/react-router";
import { signOut } from "@/features/auth/actions";

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: () => signOut(),
});
