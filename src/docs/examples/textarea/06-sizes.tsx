import { Textarea } from "nr-ui-kit";

const sizes = ["xs", "sm", "md", "lg"] as const;

export default function TextareaSizes() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      {sizes.map((size) => (
        <Textarea key={size} size={size} label={`size="${size}"`} placeholder="Write a comment..." minRows={2} />
      ))}
    </div>
  );
}
