import { useState } from "react";
import { Avatar, Button, Card, Skeleton } from "nr-ui-kit";

export default function SkeletonLoaded() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full max-w-xs flex-row items-center gap-3 p-4">
        <Skeleton isLoaded={loaded} className="h-10 w-10 shrink-0 rounded-full">
          <Avatar src="https://i.pravatar.cc/150?u=sk1" />
        </Skeleton>
        <div className="flex-1 space-y-2">
          <Skeleton isLoaded={loaded} className="h-3.5 w-3/5 rounded-full">
            <p className="text-sm font-medium text-foreground">Rafiqjon Nazirov</p>
          </Skeleton>
          <Skeleton isLoaded={loaded} className="h-3 w-4/5 rounded-full">
            <p className="text-xs text-muted">Frontend developer · Tashkent</p>
          </Skeleton>
        </div>
      </Card>
      <Button size="sm" variant="tertiary" onClick={() => setLoaded(!loaded)}>
        {loaded ? "Show skeleton" : "Load"}
      </Button>
    </div>
  );
}
