import { Avatar } from "nr-ui-kit";

export default function AvatarBasic() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Avatar src="https://i.pravatar.cc/150?u=a1" name="Ali Valiyev" />
      <Avatar src="https://i.pravatar.cc/150?u=a2" name="Dilnoza Karimova" />
      <Avatar name="Jasur Rahimov" />
      <Avatar />
    </div>
  );
}
