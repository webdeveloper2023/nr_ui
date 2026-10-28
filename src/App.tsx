import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LocaleProvider, ToastProvider } from "nr-ui-kit";
import { useLang } from "./docs/i18n/lang";
import DocsLayout from "./docs/DocsLayout";
import GettingStarted from "./docs/GettingStarted";
import ComponentPage from "./docs/ComponentPage";
import Dashboard from "./docs/templates/Dashboard";
import ColorsPage from "./docs/ColorsPage";
import { Navigate } from "react-router-dom";

export default function App() {
  // The docs language also drives the library's built-in strings (placeholders, aria-labels…)
  const [lang] = useLang();
  return (
    <LocaleProvider locale={lang}>
      <ToastProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route element={<DocsLayout />}>
              <Route index element={<GettingStarted />} />
              <Route path="colors" element={<ColorsPage />} />
              <Route path="pricing" element={<Navigate to="/" replace />} />
              <Route path="components/:slug" element={<ComponentPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </LocaleProvider>
  );
}
