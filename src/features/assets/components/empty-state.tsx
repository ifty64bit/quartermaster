import { Box, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { QuickAddDialog } from "./quick-add-dialog";

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-muted">
				<Box className="size-6 text-muted-foreground" />
			</div>
			<h3 className="mt-4 text-lg font-semibold">No assets yet</h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">
				Quick add your first asset in seconds — just a name and a price. You can
				fill in the details later.
			</p>
			<Dialog>
				<DialogTrigger>
					<Button className="mt-6">
						<Zap />
						Quick add asset
					</Button>
				</DialogTrigger>
				<QuickAddDialog />
			</Dialog>
		</div>
	);
}

export default EmptyState;
