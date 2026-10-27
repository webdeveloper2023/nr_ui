import { Timeline } from "nr-ui-kit";

export default function TimelineBasic() {
  return (
    <Timeline
      className="mx-auto max-w-md"
      items={[
        { id: "1", title: "Buyurtma qabul qilindi", time: "09:12" },
        { id: "2", title: "To'lov tasdiqlandi", time: "09:14" },
        { id: "3", title: "Omborga yuborildi", time: "11:40" },
        { id: "4", title: "Kuryer yo'lda", time: "14:05" },
      ]}
    />
  );
}
