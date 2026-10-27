import { Skeleton } from "nr-ui-kit";

export default function SkeletonStatic() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <Skeleton disableAnimation className="h-4 w-full rounded-full" />
      <Skeleton disableAnimation className="h-4 w-4/5 rounded-full" />
      <Skeleton disableAnimation className="h-4 w-3/5 rounded-full" />
    </div>
  );
}
