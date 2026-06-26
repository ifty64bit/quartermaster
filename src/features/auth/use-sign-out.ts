import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
	const navigate = useNavigate();
	return () =>
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					void navigate({ to: "/" });
				},
			},
		});
}
