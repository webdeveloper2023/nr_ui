import { PhoneInput } from "nr-ui-kit";

export default function PhoneInputValidation() {
  return (
    <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
      <PhoneInput
        country="UZ"
        label="Avtomatik tekshiruv"
        isRequired
        autoValidate
        description="Raqamni yarim yozib, maydondan chiqing"
      />
      <PhoneInput
        country="UZ"
        label="O'z xato matningiz"
        autoValidate
        incompleteMessage="Iltimos, raqamni to'liq kiriting"
        defaultValue="+99890123"
      />
    </div>
  );
}
