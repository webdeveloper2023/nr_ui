import { MoreHorizontal } from "lucide-react";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

export default function CardWithAvatar() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="items-center">
        <Avatar src="https://i.pravatar.cc/150?u=dilnoza" name="Dilnoza Karimova" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Dilnoza Karimova</p>
          <p className="text-xs text-muted">@dilnoza · 2 hours ago</p>
        </div>
        <Button isIconOnly variant="ghost" size="sm" aria-label="More">
          <MoreHorizontal size={16} />
        </Button>
      </CardHeader>
      <CardBody className="text-foreground">
        Our new design system is ready! Gray canvas, white surfaces and soft shadows — all speaking the same language.
      </CardBody>
      <CardFooter className="gap-4 text-sm text-muted">
        <span><b className="font-medium text-foreground">128</b> likes</span>
        <span><b className="font-medium text-foreground">24</b> comments</span>
      </CardFooter>
    </Card>
  );
}
