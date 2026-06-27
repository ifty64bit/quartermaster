import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import type * as React from "react";
import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

type SelectItem = {
	label: string;
	value: string | number;
};

type SelectContextValue = {
	items?: SelectItem[];
	value?: string | number | null;
};

const SelectContext = createContext<SelectContextValue>({});

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
	items?: SelectItem[];
};

function Select({ items, value, ...props }: SelectProps) {
	return (
		<SelectContext.Provider
			value={{ items, value: value as string | number | null | undefined }}
		>
			<SelectPrimitive.Root value={value} {...props} />
		</SelectContext.Provider>
	);
}

function SelectTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				"flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-[color,box-shadow] outline-hidden",
				"placeholder:text-muted-foreground",
				"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30",
				className,
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon className="flex items-center text-muted-foreground">
				<ChevronDown className="size-4" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectValue({
	placeholder,
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value> & {
	placeholder?: string;
}) {
	const { items, value } = useContext(SelectContext);

	const selectedItem = items?.find((item) => item.value === value);
	const displayValue =
		selectedItem?.label ??
		(value !== undefined && value !== null ? String(value) : placeholder);

	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			className={cn("flex-1 truncate text-left", className)}
			{...props}
		>
			{displayValue}
		</SelectPrimitive.Value>
	);
}

function SelectContent({
	className,
	children,
	positionerClassName,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Popup> & {
	positionerClassName?: string;
}) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				className={cn("z-50", positionerClassName)}
				sideOffset={4}
				alignItemWithTrigger={false}
			>
				<SelectPrimitive.Popup
					data-slot="select-popup"
					className={cn(
						"max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden transition-[transform,opacity] duration-100 ease-out data-starting-style:scale-[0.97] data-starting-style:opacity-0 data-ending-style:scale-[0.97] data-ending-style:opacity-0",
						className,
					)}
					{...props}
				>
					<SelectPrimitive.List
						data-slot="select-list"
						className="flex flex-col"
					>
						{children}
					</SelectPrimitive.List>
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"flex w-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-hidden transition-colors",
				"data-highlighted:bg-accent data-highlighted:text-accent-foreground",
				"data-disabled:pointer-events-none data-disabled:opacity-50",
				"data-selected:font-medium",
				className,
			)}
			{...props}
		>
			<SelectPrimitive.ItemIndicator className="flex items-center text-primary">
				<Check className="size-4" />
			</SelectPrimitive.ItemIndicator>
			<SelectPrimitive.ItemText
				data-slot="select-item-text"
				className="flex-1 truncate text-left"
			>
				{children}
			</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

function SelectGroup({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return (
		<SelectPrimitive.Group
			data-slot="select-group"
			className={cn("flex flex-col", className)}
			{...props}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
};
