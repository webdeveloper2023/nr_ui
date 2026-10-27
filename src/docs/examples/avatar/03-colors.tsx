import { Avatar } from "nr-ui-kit";

export default function AvatarColors() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Avatar name="Default" color="default" />
        <Avatar name="Accent" color="accent" />
        <Avatar name="Success" color="success" />
        <Avatar name="Warning" color="warning" />
        <Avatar name="Danger" color="danger" />
      </div>
      <div className="flex items-center gap-4">
        <Avatar isBordered color="default" src="https://i.pravatar.cc/150?u=b1" />
        <Avatar isBordered color="accent" src="https://i.pravatar.cc/150?u=b2" />
        <Avatar isBordered color="success" src="https://i.pravatar.cc/150?u=b3" />
        <Avatar isBordered color="warning" src="https://i.pravatar.cc/150?u=b4" />
        <Avatar isBordered color="danger" src="https://i.pravatar.cc/150?u=b5" />
      </div>
    </div>
  );
}
