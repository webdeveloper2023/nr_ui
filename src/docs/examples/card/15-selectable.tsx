import { useState } from "react";
import { Check, Rocket, Truck, Zap } from "lucide-react";
import { Card, CardBody, CardHeader } from "nr-ui-kit";

// Choice cards: isPressable + isSelected give an accent ring and aria-pressed
const options = [
  { key: "standard", icon: Truck, title: "Standard", text: "3–5 days", price: "Free" },
  { key: "express", icon: Zap, title: "Express", text: "Next day", price: "$4.90" },
  { key: "same-day", icon: Rocket, title: "Same day", text: "Within 4 hours", price: "$9.90" },
];

export default function CardSelectable() {
  const [selected, setSelected] = useState("express");

  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {options.map(({ key, icon: Icon, title, text, price }) => {
        const isSelected = selected === key;
        return (
          <Card key={key} variant="bordered" size="sm" isPressable isSelected={isSelected} onPress={() => setSelected(key)}>
            <CardHeader
              startContent={
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-default text-foreground">
                  <Icon size={16} />
                </span>
              }
              title={title}
              description={text}
              endContent={
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </span>
              }
            />
            <CardBody className="pb-3 font-medium text-foreground">{price}</CardBody>
          </Card>
        );
      })}
    </div>
  );
}
