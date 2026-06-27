import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/assets")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/assets"!</div>;
}
