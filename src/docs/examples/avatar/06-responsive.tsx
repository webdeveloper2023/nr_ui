import { Avatar, AvatarGroup } from "nr-ui-kit";

const people = ["Ali Valiyev", "Dilnoza Karimova", "Jasur Rahimov", "Madina Usmonova", "Sardor Aliyev", "Nodira Yusupova"];

// Resize the window: lg / xl avatars shrink a step on mobile and grow on desktop; the group keeps 3 avatars on mobile.
export default function AvatarResponsive() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <Avatar name="Ali Valiyev" size="lg" color="accent" responsive />
        <Avatar name="Dilnoza Karimova" size="xl" color="success" responsive />
      </div>
      <AvatarGroup max={5} size="lg" responsive>
        {people.map((name) => (
          <Avatar key={name} name={name} />
        ))}
      </AvatarGroup>
    </div>
  );
}
