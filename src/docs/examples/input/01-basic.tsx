import { Input } from "nr-ui-kit";

export default function InputBasic() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Input label="Email" type="email" placeholder="ali@acme.uz" />
    </div>
  );
}
