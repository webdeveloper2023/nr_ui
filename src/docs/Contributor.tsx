import { Avatar } from "../components";
import { useT } from "./i18n/lang";

const GITHUB_USER = "webdeveloper2023";

/** Header link to the author's GitHub profile */
export function Contributor() {
  const t = useT();
  const role = t({ en: "Contributor", uz: "Kontributor", ru: "Контрибьютор" });
  return (
    <a
      href={`https://github.com/${GITHUB_USER}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`${role}: @${GITHUB_USER}`}
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full p-0.5 pr-0.5 transition-colors hover:bg-default xl:pr-3"
    >
      <Avatar src={`https://github.com/${GITHUB_USER}.png?size=64`} name="Rafiqjon Nazirov" size="sm" className="h-8 w-8" />
      <span className="hidden flex-col leading-tight xl:flex">
        <span className="text-[11px] text-muted">{role}</span>
        <span className="text-sm font-medium text-foreground">@{GITHUB_USER}</span>
      </span>
    </a>
  );
}
