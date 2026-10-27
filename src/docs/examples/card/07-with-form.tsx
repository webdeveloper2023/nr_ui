import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "nr-ui-kit";

export default function CardWithForm() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader title="Tizimga kirish" description="Davom etish uchun hisobingizga kiring." />
      <CardBody className="gap-3">
        <Input variant="secondary" label="Email" type="email" placeholder="siz@misol.uz" />
        <Input variant="secondary" label="Parol" type="password" placeholder="••••••••" />
      </CardBody>
      <CardFooter className="flex-col">
        <Button fullWidth>Kirish</Button>
        <Button fullWidth variant="ghost">Ro'yxatdan o'tish</Button>
      </CardFooter>
    </Card>
  );
}
