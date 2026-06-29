import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/brands")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/brands"!</div>;
}
