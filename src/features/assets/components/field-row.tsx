import { cn } from "@/lib/utils";

function FieldRow({
    label,
    value,
    fallback = "—",
    strong,
}: {
    label: string;
    value?: React.ReactNode;
    fallback?: string;
    strong?: boolean;
}) {
    return (
        <>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd
                className={cn(
                    "text-right text-sm tabular-nums",
                    strong
                        ? "font-semibold text-foreground"
                        : "text-foreground",
                )}
            >
                {value ?? (
                    <span className="font-normal text-muted-foreground/50">
                        {fallback}
                    </span>
                )}
            </dd>
        </>
    );
}

export default FieldRow;
