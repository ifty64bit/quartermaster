import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Progress({
	className,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn("flex w-full flex-col gap-2", className)}
			{...props}
		/>
	);
}

function ProgressLabel({
	className,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Label>) {
	return (
		<ProgressPrimitive.Label
			data-slot="progress-label"
			className={cn("text-sm font-medium", className)}
			{...props}
		/>
	);
}

function ProgressValue({
	className,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Value>) {
	return (
		<ProgressPrimitive.Value
			data-slot="progress-value"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function ProgressTrack({
	className,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Track>) {
	return (
		<ProgressPrimitive.Track
			data-slot="progress-track"
			className={cn(
				"h-2 w-full overflow-hidden rounded-full bg-secondary",
				className,
			)}
			{...props}
		/>
	);
}

function ProgressIndicator({
	className,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Indicator>) {
	return (
		<ProgressPrimitive.Indicator
			data-slot="progress-indicator"
			className={cn(
				"h-full rounded-full bg-primary transition-[width] duration-300 ease-out data-indeterminate:animate-indeterminate",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Progress,
	ProgressIndicator,
	ProgressLabel,
	ProgressTrack,
	ProgressValue,
};
