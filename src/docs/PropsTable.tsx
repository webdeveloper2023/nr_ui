import propsData from "./props.json";
import propsUz from "./i18n/props.uz.json";
import propsRu from "./i18n/props.ru.json";
import { useLang, useT } from "./i18n/lang";

interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string | null;
}

const data = propsData as Record<string, PropDoc[]>;
// English descriptions come from JSDoc (props.json); uz / ru are translations keyed "Component.prop"
const translations = { uz: propsUz as Record<string, string>, ru: propsRu as Record<string, string> };

export function PropsTable({ component }: { component: string }) {
  const props = data[component];
  const [lang] = useLang();
  const t = useT();
  if (!props?.length) return null;
  const describe = (p: PropDoc) => (lang === "en" ? p.description : translations[lang][`${component}.${p.name}`] ?? p.description);

  return (
    <div id={`props-${component.toLowerCase()}`} className="scroll-mt-28">
      <h3 className="mb-3 text-lg font-semibold text-foreground">{component}</h3>
      <div className="overflow-x-auto rounded-3xl bg-surface p-2 shadow-surface">
        <table className="w-full min-w-[680px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-xs font-medium text-muted">
              <th className="h-10 rounded-l-xl bg-surface-secondary px-3 w-48 font-medium">{t({ en: "Prop", uz: "Prop", ru: "Свойство" })}</th>
              <th className="h-10 bg-surface-secondary px-3 font-medium">{t({ en: "Type", uz: "Turi", ru: "Тип" })}</th>
              <th className="h-10 rounded-r-xl bg-surface-secondary px-3 w-36 font-medium">{t({ en: "Default", uz: "Standart", ru: "По умолчанию" })}</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p, i) => {
              const line = i < props.length - 1 ? "border-b border-separator" : "";
              return (
                <tr key={p.name} className="align-top">
                  <td className={`px-3 py-3 ${line}`}>
                    <code className="font-mono text-[13px] font-medium text-foreground">{p.name}</code>
                    {p.required && <span className="ml-1 text-danger" title={t({ en: "Required", uz: "Majburiy", ru: "Обязательно" })}>*</span>}
                    {describe(p) && <p className="mt-1 text-xs leading-5 text-muted">{describe(p)}</p>}
                  </td>
                  <td className={`px-3 py-3 ${line}`}>
                    <code className="font-mono text-[12.5px] leading-5 text-accent-soft-foreground break-words">{p.type}</code>
                  </td>
                  <td className={`px-3 py-3 ${line}`}>
                    {p.default ? (
                      <code className="rounded-md bg-default px-1.5 py-0.5 font-mono text-[12px] text-foreground">{p.default}</code>
                    ) : (
                      <span className="text-muted/60">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PropsTable;
