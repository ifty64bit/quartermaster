import type * as React from "react";
import { cn } from "@/lib/utils";

function Input({
	className,
	type = "text",
	...props
}: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"flex h-10 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-[color,box-shadow] outline-hidden",
				"placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
				"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
