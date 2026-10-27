import { Switch } from "nr-ui-kit";

export default function SwitchWithDescription() {
  return (
    <div className="mx-auto flex w-fit flex-col gap-5">
      <Switch defaultSelected description="Har 5 daqiqada avtomatik saqlanadi">
        Avto-saqlash
      </Switch>
      <Switch description="Yangilanishlar chiqishi bilan o'rnatiladi">Avto-yangilash</Switch>
      <Switch isDisabled description="Faqat Pro tarifda">
        Zaxira nusxa
      </Switch>
    </div>
  );
}
