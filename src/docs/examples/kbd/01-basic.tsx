import { Kbd } from "nr-ui-kit";

export default function KbdBasic() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Kbd keys="command">K</Kbd>
      <Kbd keys="ctrl">C</Kbd>
      <Kbd keys="shift">Tab</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  );
}
