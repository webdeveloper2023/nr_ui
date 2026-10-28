import { Avatar, Badge } from "nr-ui-kit";

export default function BadgePlacement() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-8">
        {(["top-right", "top-left", "bottom-right", "bottom-left"] as const).map((p) => (
          <Badge key={p} content="2" color="accent" placement={p}>
            <Avatar radius="lg" src={`https://i.pravatar.cc/150?u=${p}`} />
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-8">
        {/* no content — a dot (online status) */}
        <Badge color="success" placement="bottom-right">
          <Avatar src="https://i.pravatar.cc/150?u=online" />
        </Badge>
        <Badge color="warning" placement="bottom-right" size="lg">
          <Avatar size="lg" src="https://i.pravatar.cc/150?u=away" />
        </Badge>
        <Badge color="default" placement="bottom-right">
          <Avatar src="https://i.pravatar.cc/150?u=offline" />
        </Badge>
      </div>
    </div>
  );
}
