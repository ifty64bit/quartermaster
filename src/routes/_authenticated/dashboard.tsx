import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			Hello "/_authenticated/dashboard"!
			<Link to="/logout">
				<Button>Logout</Button>
			</Link>
		</div>
	);
}
