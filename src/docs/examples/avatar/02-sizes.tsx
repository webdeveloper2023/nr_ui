import { Avatar } from "nr-ui-kit";

export default function AvatarSizes() {
  return (
    <div className="flex items-center justify-center gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size} src={`https://i.pravatar.cc/150?u=size-${size}`} name={size} />
      ))}
    </div>
  );
}
