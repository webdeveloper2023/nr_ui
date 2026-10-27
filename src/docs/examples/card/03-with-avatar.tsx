import { MoreHorizontal } from "lucide-react";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

export default function CardWithAvatar() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="items-center">
        <Avatar src="https://i.pravatar.cc/150?u=dilnoza" name="Dilnoza Karimova" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Dilnoza Karimova</p>
          <p className="text-xs text-muted">@dilnoza · 2 soat oldin</p>
        </div>
        <Button isIconOnly variant="ghost" size="sm" aria-label="Ko'proq">
          <MoreHorizontal size={16} />
        </Button>
      </CardHeader>
      <CardBody className="text-foreground">
        Yangi dizayn tizimimiz tayyor! Kulrang canvas, oq surface'lar va yumshoq soyalar — hammasi bir tilda gapiradi.
      </CardBody>
      <CardFooter className="gap-4 text-sm text-muted">
        <span><b className="font-medium text-foreground">128</b> yoqtirish</span>
        <span><b className="font-medium text-foreground">24</b> izoh</span>
      </CardFooter>
    </Card>
  );
}
