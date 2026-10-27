import { Avatar, AvatarGroup } from "nr-ui-kit";

const ids = ["g1", "g2", "g3", "g4", "g5", "g6", "g7"];

export default function AvatarGroupExample() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AvatarGroup max={4}>
        {ids.map((id) => (
          <Avatar key={id} src={`https://i.pravatar.cc/150?u=${id}`} />
        ))}
      </AvatarGroup>
      <AvatarGroup size="sm" max={3} total={24}>
        {ids.map((id) => (
          <Avatar key={id} src={`https://i.pravatar.cc/150?u=${id}x`} />
        ))}
      </AvatarGroup>
      <AvatarGroup isGrid max={6}>
        {ids.map((id) => (
          <Avatar key={id} radius="lg" src={`https://i.pravatar.cc/150?u=${id}y`} />
        ))}
      </AvatarGroup>
    </div>
  );
}
