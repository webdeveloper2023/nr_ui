import { Input } from "nr-ui-kit";

// primary — kulrang fonda (oq maydon + yengil soya)
// secondary — oq karta (surface) ichida (kulrang maydon, soyasiz)
export default function InputVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col justify-center gap-3">
        <Input variant="primary" placeholder="Primary input" />
        <Input variant="primary" label="Ism" placeholder="Ismingiz" />
      </div>
      <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
        <Input variant="secondary" placeholder="Secondary input" />
        <Input variant="secondary" label="Familiya" placeholder="Familiyangiz" />
      </div>
    </div>
  );
}
