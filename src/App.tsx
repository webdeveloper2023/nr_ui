import { BrowserRouter, Route, Routes } from "react-router-dom";
import DocsLayout from "./docs/DocsLayout";
import GettingStarted from "./docs/GettingStarted";
import ComponentPage from "./docs/ComponentPage";
import Dashboard from "./docs/templates/Dashboard";
import ColorsPage from "./docs/ColorsPage";
import PricingPage from "./docs/PricingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route element={<DocsLayout />}>
          <Route index element={<GettingStarted />} />
          <Route path="colors" element={<ColorsPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="components/:slug" element={<ComponentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
