import { Image, Music, Video } from "lucide-react";
import { Tabs } from "nr-ui-kit";

export default function TabsWithIcons() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Tabs
        tabs={[
          { key: "photos", title: "Photos", icon: <Image size={16} /> },
          { key: "music", title: "Music", icon: <Music size={16} /> },
          { key: "videos", title: "Videos", icon: <Video size={16} /> },
        ]}
      />
      <Tabs
        variant="secondary"
        tabs={[
          { key: "photos", title: "Photos", icon: <Image size={16} /> },
          { key: "music", title: "Music", icon: <Music size={16} /> },
          { key: "videos", title: "Videos", icon: <Video size={16} /> },
        ]}
      />
    </div>
  );
}
