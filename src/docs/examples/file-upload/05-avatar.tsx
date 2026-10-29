import { FileUpload } from "nr-ui-kit";

// One round image: shows the photo after picking, "Change" on hover and a remove button in the corner
export default function FileUploadAvatar() {
  return (
    <div className="flex w-full flex-wrap items-center gap-x-10 gap-y-6">
      <FileUpload layout="avatar" size="sm" label="Photo" description="sm" />
      <FileUpload layout="avatar" size="md" label="Photo" description="md" />
      <FileUpload layout="avatar" size="lg" label="Profile photo" description="JPG or PNG, 2 MB" maxSizeMB={2} />
      <FileUpload layout="avatar" size="xl" label="Rafiqjon Nazirov" description="Upload a photo for your profile" />
    </div>
  );
}
