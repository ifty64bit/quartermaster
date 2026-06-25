import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { data, isPending } = authClient.useSession();

	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<p className="mt-4 text-lg">
				{isPending
					? "Loading..."
					: data?.user
						? `Hello, ${data.user.name ?? data.user.email}!`
						: "You are not logged in."}
			</p>
			<p className="mt-2 text-lg">
				{data?.user ? (
					<a href="/logout" className="text-blue-500 hover:underline">
						Log out
					</a>
				) : (
					<Link to="/login" className="text-blue-500 hover:underline">
						Log in
					</Link>
				)}
			</p>
			<p className="mt-2 text-lg">
				<Link to="/dashboard" className="text-blue-500 hover:underline">
					Dashboard
				</Link>
			</p>
		</div>
	);
}
