import { Button, Card, CardBody, CardFooter, CardHeader } from "nr-ui-kit";

export default function CardBasic() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader title="Pro tarifga o'ting" description="Jamoangiz uchun cheksiz loyihalar va analitika." />
      <CardBody className="text-muted">
        Har oy 14 kunlik bepul sinov muddati bilan. Istalgan vaqtda bekor qilishingiz mumkin.
      </CardBody>
      <CardFooter>
        <Button variant="tertiary" size="sm">Keyinroq</Button>
        <Button size="sm">Boshlash</Button>
      </CardFooter>
    </Card>
  );
}
