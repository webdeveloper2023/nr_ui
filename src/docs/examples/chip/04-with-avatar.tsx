import { Avatar, Chip } from "nr-ui-kit";

const people = [
  { id: "c1", name: "Ali" },
  { id: "c2", name: "Dilnoza" },
  { id: "c3", name: "Jasur" },
];

export default function ChipWithAvatar() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {people.map((p) => (
        <Chip key={p.id} size="lg" variant="secondary" avatar={<Avatar src={`https://i.pravatar.cc/150?u=${p.id}`} name={p.name} />}>
          {p.name}
        </Chip>
      ))}
    </div>
  );
}
