import { BrowserRouter, Route, Routes } from "react-router-dom";
import DocsLayout from "./docs/DocsLayout";
import GettingStarted from "./docs/GettingStarted";
import ComponentPage from "./docs/ComponentPage";
import Dashboard from "./docs/templates/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route element={<DocsLayout />}>
          <Route index element={<GettingStarted />} />
          <Route path="components/:slug" element={<ComponentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
