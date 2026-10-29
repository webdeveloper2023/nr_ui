import { FileUpload } from "nr-ui-kit";

// default: white surface, secondary: gray (for use inside a card), flat: soft fill without a dashed border
export default function FileUploadVariants() {
  return (
    <div className="grid w-full gap-4 md:grid-cols-3">
      <FileUpload variant="default" size="sm" label="Default" />
      <FileUpload variant="secondary" size="sm" label="Secondary" />
      <FileUpload variant="flat" size="sm" label="Flat" />
    </div>
  );
}
