import { useState } from "react";
import { Button, Card, Table, SegmentedTabs, Sidebar, Layout } from "./components";
import {
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Search,
  Plus,
  Download,
  Trash2,
  Edit3,
  Mail,
  ShieldCheck,
  Layers,
} from "lucide-react";

const sidebarSections = [
  {
    title: "Main",
    items: [
      { key: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
      { key: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
      {
        key: "users",
        label: "Users",
        icon: <Users size={18} />,
        badge: <span className="bg-primary-100 text-primary-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">24</span>,
        children: [
          { key: "users-all", label: "All Users" },
          { key: "users-admins", label: "Admins" },
          { key: "users-roles", label: "Roles", icon: <ShieldCheck size={16} /> },
        ],
      },
    ],
  },
  {
    title: "Content",
    items: [
      { key: "documents", label: "Documents", icon: <FileText size={18} /> },
      { key: "notifications", label: "Notifications", icon: <Bell size={18} /> },
      { key: "settings", label: "Settings", icon: <Settings size={18} /> },
    ],
  },
];

const tableColumns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (row: Record<string, unknown>) => (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
          row.status === "Active"
            ? "bg-green-100 text-green-700"
            : row.status === "Inactive"
            ? "bg-default-100 text-default-500"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${
          row.status === "Active" ? "bg-green-500" : row.status === "Inactive" ? "bg-default-400" : "bg-amber-500"
        }`} />
        {row.status as string}
      </span>
    ),
  },
  {
    key: "actions",
    label: "",
    render: () => (
      <div className="flex gap-1">
        <Button variant="light" size="sm" isIconOnly><Edit3 size={14} /></Button>
        <Button variant="light" size="sm" color="danger" isIconOnly><Trash2 size={14} /></Button>
      </div>
    ),
  },
];

const tableRows = [
  { id: "1", name: "Nazirov Rafiqjon", role: "Admin", email: "rafiq@sudacademy.uz", status: "Active" },
  { id: "2", name: "Alisher Karimov", role: "Editor", email: "alisher@gmail.com", status: "Active" },
  { id: "3", name: "Dilshod Toshmatov", role: "Viewer", email: "dilshod@mail.ru", status: "Inactive" },
  { id: "4", name: "Madina Rahimova", role: "Editor", email: "madina@gmail.com", status: "Pending" },
  { id: "5", name: "Sardor Numonov", role: "Admin", email: "sardor@sudacademy.uz", status: "Active" },
];

const segTabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const viewTabs = [
  { key: "overview", label: "Overview", icon: <Layers size={14} /> },
  { key: "analytics", label: "Analytics", icon: <BarChart3 size={14} /> },
  { key: "reports", label: "Reports", icon: <FileText size={14} /> },
];

export default function App() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  return (
    <Layout
      sidebar={
        <Sidebar
          sections={sidebarSections}
          activeKey={activeNav}
          onSelect={setActiveNav}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          header={
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                N
              </div>
              <span className="font-semibold text-default-900 text-sm">NR UI</span>
            </div>
          }
          footer={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                RN
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-medium text-default-800 truncate">Rafiqjon N.</div>
                  <div className="text-[10px] text-default-400 truncate">rafiq@sudacademy.uz</div>
                </div>
              )}
            </div>
          }
        />
      }
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-default-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-default-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 pl-9 pr-4 text-sm rounded-lg border border-default-200 bg-default-50 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all w-56"
              />
            </div>
            <Button variant="light" isIconOnly>
              <Bell size={18} />
            </Button>
          </div>
        </div>
      }
    >
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: "2,847", change: "+12.5%", color: "text-green-600", icon: <Users size={20} /> },
          { label: "Revenue", value: "$45,231", change: "+8.2%", color: "text-green-600", icon: <BarChart3 size={20} /> },
          { label: "Documents", value: "1,234", change: "-2.4%", color: "text-red-500", icon: <FileText size={20} /> },
          { label: "Messages", value: "891", change: "+23.1%", color: "text-green-600", icon: <Mail size={20} /> },
        ].map((stat) => (
          <Card key={stat.label} isHoverable>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-default-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-default-900">{stat.value}</p>
                <p className={`text-xs mt-1 font-medium ${stat.color}`}>{stat.change} from last month</p>
              </div>
              <div className="p-2 bg-primary-50 rounded-lg text-primary-500">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* View tabs */}
      <div className="mb-6">
        <SegmentedTabs tabs={viewTabs} color="primary" radius="lg" />
      </div>

      {/* Table section */}
      <Card radius="lg" shadow="sm" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-default-900">Team Members</h2>
            <p className="text-xs text-default-500 mt-0.5">Manage your team members and their roles</p>
          </div>
          <div className="flex items-center gap-2">
            <SegmentedTabs tabs={segTabs} activeKey={activeTab} onChange={setActiveTab} size="sm" radius="full" />
            <Button color="primary" size="sm" startContent={<Plus size={14} />}>Add User</Button>
            <Button variant="bordered" size="sm" startContent={<Download size={14} />}>Export</Button>
          </div>
        </div>
        <Table
          columns={tableColumns}
          rows={tableRows}
          keyField="id"
          isStriped
          selectionMode="multiple"
          selectedKeys={selectedRows}
          onSelectionChange={setSelectedRows}
          radius="md"
        />
      </Card>

      {/* Button showcase */}
      <Card radius="lg" shadow="sm">
        <h2 className="text-base font-semibold text-default-900 mb-4">Button Variants</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button color="primary">Solid</Button>
            <Button color="primary" variant="bordered">Bordered</Button>
            <Button color="primary" variant="flat">Flat</Button>
            <Button color="primary" variant="light">Light</Button>
            <Button color="primary" variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button color="default">Default</Button>
            <Button color="primary">Primary</Button>
            <Button color="success">Success</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button color="primary" size="sm">Small</Button>
            <Button color="primary" size="md">Medium</Button>
            <Button color="primary" size="lg">Large</Button>
            <Button color="primary" radius="full">Rounded</Button>
            <Button color="primary" isLoading>Loading</Button>
            <Button color="primary" isDisabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button color="primary" startContent={<Plus size={16} />}>Create New</Button>
            <Button color="danger" variant="flat" startContent={<Trash2 size={16} />}>Delete</Button>
            <Button variant="bordered" startContent={<Download size={16} />}>Download</Button>
            <Button color="primary" isIconOnly radius="full"><Search size={16} /></Button>
            <Button color="primary" variant="flat" isIconOnly radius="full"><Settings size={16} /></Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
