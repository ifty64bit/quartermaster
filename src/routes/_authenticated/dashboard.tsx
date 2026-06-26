import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <section>Hello, World!</section>;
}
