import { FolderPlus, Plus } from "lucide-react";
import { Button, Card, CardBody } from "nr-ui-kit";

// variant="dashed": an empty slot that invites the first action
export default function CardEmptyState() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Card variant="dashed" size="lg">
        <CardBody className="items-center py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-default text-muted">
            <FolderPlus size={22} />
          </span>
          <p className="mt-2 font-medium text-foreground">No projects yet</p>
          <p className="text-muted">Create a project to start inviting your team.</p>
          <Button className="mt-3" startContent={<Plus size={15} />}>New project</Button>
        </CardBody>
      </Card>
      <Card variant="dashed" size="lg" isPressable className="hover:border-accent/50">
        <CardBody className="h-full items-center justify-center py-10 text-muted">
          <Plus size={22} />
          <p className="font-medium">Add a widget</p>
        </CardBody>
      </Card>
    </div>
  );
}
