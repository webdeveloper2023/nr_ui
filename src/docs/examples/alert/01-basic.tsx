import { Alert } from "nr-ui-kit";

export default function AlertBasic() {
  return (
    <div className="mx-auto max-w-xl">
      <Alert
        title="Yangi versiya chiqdi"
        description="NR UI 2.0 — yangilangan dizayn, dark mode va 40+ komponent. Yangilash uchun npm update qiling."
      />
    </div>
  );
}
