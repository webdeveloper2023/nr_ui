import { Checkbox } from "nr-ui-kit";

export default function CheckboxWithDescription() {
  return (
    <div className="mx-auto flex w-fit flex-col gap-4">
      <Checkbox defaultSelected description="Har hafta yangiliklar va maqolalar">
        Email obunasi
      </Checkbox>
      <Checkbox description="Yangi kirishlar haqida xabar beramiz">Xavfsizlik ogohlantirishlari</Checkbox>
      <Checkbox isInvalid description="Davom etish uchun majburiy">
        Maxfiylik siyosatiga roziman
      </Checkbox>
      <Checkbox isDisabled>O'chirilgan</Checkbox>
    </div>
  );
}
