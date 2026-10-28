import * as NR from "nr-ui-kit";
import { registry } from "./registry";

// One counting rule for the docs site and the README (tests/docs-consistency.test.ts keeps them in sync):
// - components: documented component families, one docs page each (Modal, Table, Card…)
// - parts:      every exported React component, sub-parts included (ModalHeader, CardBody, SidebarItem…)
export const COMPONENT_COUNT = registry.length;
export const PART_COUNT = Object.entries(NR).filter(
  ([name, value]) => /^[A-Z][a-z]/.test(name) && (typeof value === "function" || (typeof value === "object" && value !== null && "$$typeof" in value))
).length;
