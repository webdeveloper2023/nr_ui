import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "nr-ui-kit";

function ProfilePopover({ isBlurred }: { isBlurred: boolean }) {
  return (
    <Popover placement="bottom" showArrow isBlurred={isBlurred}>
      <PopoverTrigger>
        <Button variant="secondary">{isBlurred ? "Glass" : "Solid"}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Madina Usmonova" color="accent" />
          <div>
            <p className="text-sm font-semibold text-foreground">Madina Usmonova</p>
            <p className="text-xs text-muted">Product designer</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">Shisha orqasidagi ranglar xira ko'rinadi, matn esa aniq o'qiladi.</p>
      </PopoverContent>
    </Popover>
  );
}

export default function PopoverGlassAndSolid() {
  return (
    <div className="relative h-72 overflow-hidden rounded-3xl p-8">
      <div className="absolute left-6 top-4 size-48 rounded-full bg-blue blur-2xl opacity-70" />
      <div className="absolute right-6 top-10 size-56 rounded-full bg-purple blur-2xl opacity-60" />
      <div className="absolute bottom-0 left-1/3 size-48 rounded-full bg-yellow blur-2xl opacity-60" />
      <div className="relative flex flex-wrap justify-center gap-4">
        <ProfilePopover isBlurred />
        <ProfilePopover isBlurred={false} />
      </div>
    </div>
  );
}
