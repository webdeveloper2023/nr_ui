import { Avatar, Tooltip } from "nr-ui-kit";

export default function TooltipRichContent() {
  return (
    <div className="flex justify-center">
      <Tooltip
        size="lg"
        radius="lg"
        content={
          <div className="flex items-center gap-3 py-1">
            <Avatar src="https://i.pravatar.cc/150?u=dilnoza" size="sm" />
            <div>
              <p className="text-sm font-medium text-foreground">Dilnoza Karimova</p>
              <p className="text-xs text-muted">Tech Lead · Toshkent</p>
            </div>
          </div>
        }
      >
        <span className="cursor-default text-sm text-foreground underline decoration-dotted underline-offset-4">@dilnoza</span>
      </Tooltip>
    </div>
  );
}
