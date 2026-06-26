import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authMiddleware } from "@/server/middleware/auth-middleware";

export const Route = createFileRoute("/_authenticated")({
	server: {
		middleware: [authMiddleware],
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return <Outlet />;
}
