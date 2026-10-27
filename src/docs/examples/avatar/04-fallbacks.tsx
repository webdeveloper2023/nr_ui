import { Building2, User } from "lucide-react";
import { Avatar } from "nr-ui-kit";

export default function AvatarFallbacks() {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* rasm yuklanmasa — initsiallar */}
      <Avatar src="https://broken.link/avatar.png" name="Madina Usmonova" />
      {/* faqat ism */}
      <Avatar name="Bekzod" color="accent" />
      {/* maxsus ikonka */}
      <Avatar icon={<User size={18} />} />
      <Avatar radius="lg" color="success" icon={<Building2 size={18} />} />
      {/* initsiallarni o'zingiz hosil qiling */}
      <Avatar name="Nazirov Rafiqjon" getInitials={(n) => n.split(" ")[1][0]} color="warning" />
    </div>
  );
}
