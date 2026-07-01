import type { LucideIcon } from "lucide-react";

function DetailSection({
    icon: Icon,
    heading,
    children,
}: {
    icon: LucideIcon;
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                <Icon className="size-4" />
                {heading}
            </h2>
            {children}
        </section>
    );
}

export default DetailSection;
