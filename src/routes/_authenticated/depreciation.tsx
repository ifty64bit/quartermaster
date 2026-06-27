import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/depreciation")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/depreciation"!</div>;
}
