import { Textarea } from "nr-ui-kit";

export default function TextareaStates() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      <Textarea label="Majburiy" isRequired placeholder="Manzil" minRows={2} />
      <Textarea label="Xato" isInvalid errorMessage="Kamida 20 ta belgi" defaultValue="Juda qisqa" minRows={2} />
      <Textarea label="O'chirilgan" isDisabled defaultValue="Tahrirlab bo'lmaydi" minRows={2} />
    </div>
  );
}
