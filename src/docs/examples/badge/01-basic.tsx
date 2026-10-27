import { Avatar, Badge } from "nr-ui-kit";

export default function BadgeBasic() {
  return (
    <div className="flex items-center justify-center gap-8">
      <Badge content="5">
        <Avatar src="https://i.pravatar.cc/150?u=badge1" />
      </Badge>
      <Badge content="12" color="accent">
        <Avatar radius="lg" src="https://i.pravatar.cc/150?u=badge2" />
      </Badge>
      <Badge content="99+" shape="rectangle">
        <Avatar radius="lg" name="AV" />
      </Badge>
    </div>
  );
}
