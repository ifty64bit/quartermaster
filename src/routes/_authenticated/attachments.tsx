import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/attachments")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/attachments"!</div>;
}
