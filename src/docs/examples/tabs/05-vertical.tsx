import { Tabs } from "nr-ui-kit";

const content: Record<string, { title: string; text: string }> = {
  account: { title: "Account settings", text: "Manage your account details and preferences." },
  security: { title: "Security", text: "Password, two-factor authentication and sessions." },
  notifications: { title: "Notifications", text: "Choose which messages you receive." },
  billing: { title: "Billing", text: "Plan, invoices and payment methods." },
};

export default function TabsVertical() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Tabs
        isVertical
        tabs={[
          { key: "account", title: "Account" },
          { key: "security", title: "Security" },
          { key: "notifications", title: "Notifications" },
          { key: "billing", title: "Billing" },
        ]}
      >
        {(key) => (
          <div className="pt-1">
            <p className="font-medium text-foreground">{content[key].title}</p>
            <p className="mt-1 text-muted">{content[key].text}</p>
          </div>
        )}
      </Tabs>
    </div>
  );
}
