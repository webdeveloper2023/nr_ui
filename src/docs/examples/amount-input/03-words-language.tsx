import { AmountInput } from "nr-ui-kit";

// The words follow <LocaleProvider>, or set wordsLocale per field
export default function AmountInputWordsLanguage() {
  return (
    <div className="grid max-w-sm gap-6">
      <AmountInput label="English" wordsLocale="en" defaultValue={2021000} />
      <AmountInput label="O'zbekcha" wordsLocale="uz" defaultValue={2021000} />
      <AmountInput label="Русский" wordsLocale="ru" defaultValue={2021000} />
    </div>
  );
}
