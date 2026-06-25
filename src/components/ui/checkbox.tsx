import { Check } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({
	className,
	checked,
	onCheckedChange,
	...props
}: Omit<React.ComponentProps<"input">, "onChange" | "type" | "checked"> & {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}) {
	return (
		<span className="relative inline-flex size-4 shrink-0 items-center justify-center">
			<input
				type="checkbox"
				data-slot="checkbox"
				checked={checked ?? false}
				onChange={(e) => onCheckedChange?.(e.target.checked)}
				aria-checked={checked ?? false}
				className={cn(
					"peer size-4 appearance-none rounded-[4px] border border-input shadow-sm transition-colors outline-hidden",
					"focus-visible:ring-[3px] focus-visible:ring-ring/40",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"checked:border-primary checked:bg-primary",
					className,
				)}
				{...props}
			/>
			<Check
				className="pointer-events-none absolute size-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
				strokeWidth={3}
			/>
		</span>
	);
}

export { Checkbox };
