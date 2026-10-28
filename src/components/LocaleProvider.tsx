import { useMemo, type ReactNode } from "react";
import { LocaleContext, NR_MESSAGES, mergeMessages, type DeepPartial, type NRLocale, type NRMessages } from "./locale";

export interface LocaleProviderProps {
  /** Language of the library's built-in texts and aria-labels */
  locale?: NRLocale;
  /** Override individual messages (merged over the chosen locale) */
  messages?: DeepPartial<NRMessages>;
  /** The part of the app the locale applies to */
  children: ReactNode;
}

export function LocaleProvider({ locale = "en", messages, children }: LocaleProviderProps) {
  const value = useMemo(
    () => ({ locale, messages: mergeMessages(NR_MESSAGES[locale] ?? NR_MESSAGES.en, messages) }),
    [locale, messages]
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export default LocaleProvider;
