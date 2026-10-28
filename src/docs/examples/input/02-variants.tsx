import { Input } from "nr-ui-kit";

// primary — on the gray canvas (white field + soft shadow)
// secondary — inside a white card (surface): gray field, no shadow
export default function InputVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col justify-center gap-3">
        <Input variant="primary" placeholder="Primary input" />
        <Input variant="primary" label="First name" placeholder="Your first name" />
      </div>
      <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
        <Input variant="secondary" placeholder="Secondary input" />
        <Input variant="secondary" label="Last name" placeholder="Your last name" />
      </div>
    </div>
  );
}
