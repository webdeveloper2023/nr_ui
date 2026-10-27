import { Avatar, Badge } from "nr-ui-kit";

const colors = ["default", "accent", "success", "warning", "danger"] as const;

export default function BadgeColors() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-8">
        {colors.map((c) => (
          <Badge key={c} content="3" color={c}>
            <Avatar radius="lg" name={c} />
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-8">
        {colors.map((c) => (
          <Badge key={c} content="3" color={c} variant="soft">
            <Avatar radius="lg" name={c} />
          </Badge>
        ))}
      </div>
    </div>
  );
}
