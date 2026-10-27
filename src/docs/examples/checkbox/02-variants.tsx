import { Checkbox } from "nr-ui-kit";

// primary — kulrang fonda; secondary — oq karta ichida
export default function CheckboxVariants() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col justify-center gap-3">
        <Checkbox variant="primary" description="Oq katakcha va yengil soya">
          Primary checkbox
        </Checkbox>
        <Checkbox variant="primary" defaultSelected>
          Tanlangan
        </Checkbox>
      </div>
      <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
        <Checkbox variant="secondary" description="Karta ichida ishlatish uchun">
          Secondary checkbox
        </Checkbox>
        <Checkbox variant="secondary" defaultSelected>
          Tanlangan
        </Checkbox>
      </div>
    </div>
  );
}
