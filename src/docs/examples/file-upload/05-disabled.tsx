import { FileUpload } from "nr-ui-kit";

export default function FileUploadDisabled() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <FileUpload isDisabled label="Yuklash vaqtincha o'chirilgan" description="Limit tugadi — tarifingizni yangilang" />
    </div>
  );
}
