import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Switch,
  Avatar,
  AvatarGroup,
  Badge,
  Chip,
  Spinner,
  Progress,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tabs,
  Table,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Accordion,
  AccordionItem,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Select,
} from "./components";
import {
  Heart,
  Camera,
  Mail,
  Lock,
  Search,
  Plus,
  Download,
  Trash2,
  Edit3,
  Copy,
  Share2,
  Settings,
  User,
  Bell,
  ChevronDown,
  Star,
  Zap,
  Shield,
  Globe,
  Bookmark,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Section wrapper ────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-default-900 mb-1">{title}</h2>
      <Divider className="mb-6" />
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ─── App ────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkVal, setCheckVal] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(65);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-violet-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap size={14} /> v1.0.0 — NR UI Component Library
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">NR UI</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Beautiful, fast, and modern React UI components.
          </p>
          <div className="flex gap-3 justify-center">
            <Button color="default" variant="shadow" size="lg" radius="full" startContent={<Globe size={18} />}>
              Get Started
            </Button>
            <Button variant="bordered" size="lg" radius="full" className="border-white/40 text-white hover:bg-white/10">
              Documentation
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ━━━ BUTTONS ━━━ */}
        <Section title="Button">
          <SubSection title="Variants">
            <div className="flex flex-wrap gap-3">
              <Button color="primary" variant="solid">Solid</Button>
              <Button color="primary" variant="bordered">Bordered</Button>
              <Button color="primary" variant="flat">Flat</Button>
              <Button color="primary" variant="light">Light</Button>
              <Button color="primary" variant="ghost">Ghost</Button>
              <Button color="primary" variant="shadow">Shadow</Button>
            </div>
          </SubSection>
          <SubSection title="Colors">
            <div className="flex flex-wrap gap-3">
              <Button color="default">Default</Button>
              <Button color="primary">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button color="success">Success</Button>
              <Button color="warning">Warning</Button>
              <Button color="danger">Danger</Button>
            </div>
          </SubSection>
          <SubSection title="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button color="primary" size="sm">Small</Button>
              <Button color="primary" size="md">Medium</Button>
              <Button color="primary" size="lg">Large</Button>
            </div>
          </SubSection>
          <SubSection title="Radius">
            <div className="flex flex-wrap items-center gap-3">
              <Button color="primary" radius="none">None</Button>
              <Button color="primary" radius="sm">Small</Button>
              <Button color="primary" radius="md">Medium</Button>
              <Button color="primary" radius="lg">Large</Button>
              <Button color="primary" radius="full">Full</Button>
            </div>
          </SubSection>
          <SubSection title="With Icons & States">
            <div className="flex flex-wrap items-center gap-3">
              <Button color="primary" startContent={<Plus size={16} />}>Add New</Button>
              <Button color="success" endContent={<Download size={16} />}>Download</Button>
              <Button color="danger" variant="flat" startContent={<Trash2 size={16} />}>Delete</Button>
              <Button color="primary" isIconOnly radius="full"><Heart size={16} /></Button>
              <Button color="secondary" isIconOnly variant="flat"><Camera size={16} /></Button>
              <Button color="primary" isLoading>Loading</Button>
              <Button color="primary" isDisabled>Disabled</Button>
              <Button color="primary" fullWidth>Full Width</Button>
            </div>
          </SubSection>
        </Section>

        {/* ━━━ INPUT ━━━ */}
        <Section title="Input">
          <SubSection title="Variants">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input variant="flat" label="Flat" placeholder="Enter text" />
              <Input variant="bordered" label="Bordered" placeholder="Enter text" />
              <Input variant="underlined" label="Underlined" placeholder="Enter text" />
              <Input variant="faded" label="Faded" placeholder="Enter text" />
            </div>
          </SubSection>
          <SubSection title="With Icons & Validation">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Email"
                placeholder="you@example.com"
                variant="bordered"
                startContent={<Mail size={16} className="text-default-400" />}
              />
              <Input
                label="Password"
                placeholder="Enter password"
                variant="bordered"
                type={showPassword ? "text" : "password"}
                startContent={<Lock size={16} className="text-default-400" />}
                endContent={
                  <button onClick={() => setShowPassword(!showPassword)} className="cursor-pointer text-default-400 hover:text-default-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <Input
                label="Search"
                placeholder="Search..."
                variant="bordered"
                startContent={<Search size={16} className="text-default-400" />}
              />
              <Input
                label="Username"
                variant="bordered"
                isInvalid
                errorMessage="Username is already taken"
                defaultValue="admin"
              />
              <Input
                label="Website"
                variant="bordered"
                placeholder="nrui.dev"
                description="Enter your portfolio URL"
                startContent={<span className="text-default-400 text-sm">https://</span>}
              />
              <Input label="Disabled" variant="bordered" isDisabled placeholder="Can't type here" />
            </div>
          </SubSection>
        </Section>

        {/* ━━━ CHECKBOX & SWITCH ━━━ */}
        <Section title="Checkbox & Switch">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SubSection title="Checkbox">
                <div className="flex flex-col gap-3">
                  <Checkbox defaultSelected>Default checked</Checkbox>
                  <Checkbox color="primary" isSelected={checkVal} onChange={setCheckVal}>Primary color</Checkbox>
                  <Checkbox color="success">Success</Checkbox>
                  <Checkbox color="warning">Warning</Checkbox>
                  <Checkbox color="danger">Danger</Checkbox>
                  <Checkbox isIndeterminate>Indeterminate</Checkbox>
                  <Checkbox isDisabled>Disabled</Checkbox>
                  <div className="flex gap-6 mt-2">
                    <Checkbox size="sm" defaultSelected>Small</Checkbox>
                    <Checkbox size="md" defaultSelected>Medium</Checkbox>
                    <Checkbox size="lg" defaultSelected>Large</Checkbox>
                  </div>
                </div>
              </SubSection>
            </div>
            <div>
              <SubSection title="Switch">
                <div className="flex flex-col gap-3">
                  <Switch isSelected={switchVal} onChange={setSwitchVal}>Notifications</Switch>
                  <Switch color="primary" defaultSelected>Primary</Switch>
                  <Switch color="success" defaultSelected>Success</Switch>
                  <Switch color="warning" defaultSelected>Warning</Switch>
                  <Switch color="danger" defaultSelected>Danger</Switch>
                  <Switch isDisabled>Disabled</Switch>
                  <div className="flex gap-6 mt-2">
                    <Switch size="sm" defaultSelected>Small</Switch>
                    <Switch size="md" defaultSelected>Medium</Switch>
                    <Switch size="lg" defaultSelected>Large</Switch>
                  </div>
                </div>
              </SubSection>
            </div>
          </div>
        </Section>

        {/* ━━━ SELECT ━━━ */}
        <Section title="Select">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Country"
              placeholder="Select a country"
              variant="bordered"
              items={[
                { key: "uz", label: "Uzbekistan" },
                { key: "us", label: "United States" },
                { key: "uk", label: "United Kingdom" },
                { key: "de", label: "Germany" },
                { key: "jp", label: "Japan" },
              ]}
            />
            <Select
              label="Role"
              placeholder="Select role"
              variant="flat"
              items={[
                { key: "admin", label: "Admin", description: "Full access" },
                { key: "editor", label: "Editor", description: "Can edit content" },
                { key: "viewer", label: "Viewer", description: "Read only" },
              ]}
            />
            <Select
              label="Status"
              placeholder="Select status"
              variant="bordered"
              isInvalid
              errorMessage="Please select a status"
              items={[
                { key: "active", label: "Active" },
                { key: "inactive", label: "Inactive" },
                { key: "pending", label: "Pending" },
              ]}
            />
          </div>
        </Section>

        {/* ━━━ AVATAR & BADGE ━━━ */}
        <Section title="Avatar & Badge">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SubSection title="Avatar">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Avatar src="https://i.pravatar.cc/150?u=a" name="Anna" size="sm" />
                  <Avatar src="https://i.pravatar.cc/150?u=b" name="Boris" size="md" />
                  <Avatar src="https://i.pravatar.cc/150?u=c" name="Clara" size="lg" />
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Avatar name="Rafiq N" color="primary" />
                  <Avatar name="John D" color="success" />
                  <Avatar name="Ali K" color="warning" />
                  <Avatar name="Sara M" color="danger" />
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Avatar src="https://i.pravatar.cc/150?u=d" isBordered color="primary" />
                  <Avatar src="https://i.pravatar.cc/150?u=e" isBordered color="success" />
                  <Avatar src="https://i.pravatar.cc/150?u=f" isBordered color="danger" />
                </div>
                <AvatarGroup max={3}>
                  <Avatar src="https://i.pravatar.cc/150?u=1" name="A" />
                  <Avatar src="https://i.pravatar.cc/150?u=2" name="B" />
                  <Avatar src="https://i.pravatar.cc/150?u=3" name="C" />
                  <Avatar src="https://i.pravatar.cc/150?u=4" name="D" />
                  <Avatar src="https://i.pravatar.cc/150?u=5" name="E" />
                </AvatarGroup>
              </SubSection>
            </div>
            <div>
              <SubSection title="Badge">
                <div className="flex flex-wrap items-center gap-6">
                  <Badge content="5" color="danger">
                    <Avatar src="https://i.pravatar.cc/150?u=g" name="User" />
                  </Badge>
                  <Badge content="99+" color="primary">
                    <Avatar src="https://i.pravatar.cc/150?u=h" name="User" />
                  </Badge>
                  <Badge color="success">
                    <Avatar src="https://i.pravatar.cc/150?u=i" name="User" />
                  </Badge>
                  <Badge content="NEW" color="warning" variant="flat">
                    <Button variant="flat" isIconOnly><Bell size={18} /></Button>
                  </Badge>
                </div>
              </SubSection>
            </div>
          </div>
        </Section>

        {/* ━━━ CHIP ━━━ */}
        <Section title="Chip">
          <SubSection title="Variants & Colors">
            <div className="flex flex-wrap gap-3 mb-4">
              <Chip color="default">Default</Chip>
              <Chip color="primary">Primary</Chip>
              <Chip color="secondary">Secondary</Chip>
              <Chip color="success">Success</Chip>
              <Chip color="warning">Warning</Chip>
              <Chip color="danger">Danger</Chip>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Chip variant="bordered" color="primary">Bordered</Chip>
              <Chip variant="light" color="success">Light</Chip>
              <Chip variant="flat" color="warning">Flat</Chip>
              <Chip variant="dot" color="danger">Dot</Chip>
            </div>
            <div className="flex flex-wrap gap-3">
              <Chip color="primary" onClose={() => {}}>Closable</Chip>
              <Chip color="success" startContent={<Star size={12} />}>Featured</Chip>
              <Chip color="warning" size="sm">Small</Chip>
              <Chip color="danger" size="lg">Large</Chip>
            </div>
          </SubSection>
        </Section>

        {/* ━━━ TOOLTIP ━━━ */}
        <Section title="Tooltip">
          <div className="flex flex-wrap gap-4">
            <Tooltip content="I am a tooltip" placement="top">
              <Button variant="flat">Top</Button>
            </Tooltip>
            <Tooltip content="I am a tooltip" placement="bottom">
              <Button variant="flat">Bottom</Button>
            </Tooltip>
            <Tooltip content="I am a tooltip" placement="left">
              <Button variant="flat">Left</Button>
            </Tooltip>
            <Tooltip content="I am a tooltip" placement="right">
              <Button variant="flat">Right</Button>
            </Tooltip>
            <Tooltip content="Primary tooltip" color="primary" showArrow>
              <Button color="primary" variant="flat">With Arrow</Button>
            </Tooltip>
            <Tooltip content="Success!" color="success" showArrow>
              <Button color="success" variant="flat">Success</Button>
            </Tooltip>
          </div>
        </Section>

        {/* ━━━ TABS ━━━ */}
        <Section title="Tabs">
          <SubSection title="Variants">
            <div className="space-y-6">
              <div>
                <p className="text-xs text-default-400 mb-2">Solid</p>
                <Tabs
                  variant="solid"
                  color="primary"
                  tabs={[
                    { key: "photos", title: "Photos", icon: <Camera size={14} /> },
                    { key: "music", title: "Music" },
                    { key: "videos", title: "Videos" },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-default-400 mb-2">Underlined</p>
                <Tabs
                  variant="underlined"
                  color="primary"
                  tabs={[
                    { key: "photos", title: "Photos" },
                    { key: "music", title: "Music" },
                    { key: "videos", title: "Videos" },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-default-400 mb-2">Bordered</p>
                <Tabs
                  variant="bordered"
                  tabs={[
                    { key: "photos", title: "Photos" },
                    { key: "music", title: "Music" },
                    { key: "videos", title: "Videos" },
                  ]}
                />
              </div>
              <div>
                <p className="text-xs text-default-400 mb-2">Light</p>
                <Tabs
                  variant="light"
                  color="primary"
                  tabs={[
                    { key: "photos", title: "Photos" },
                    { key: "music", title: "Music" },
                    { key: "videos", title: "Videos" },
                  ]}
                />
              </div>
            </div>
          </SubSection>
        </Section>

        {/* ━━━ CARD ━━━ */}
        <Section title="Card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar name="Rafiq" color="primary" size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-default-900">Nazirov Rafiqjon</p>
                    <p className="text-xs text-default-500">Frontend Developer</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  Building beautiful and performant web applications with modern tools and frameworks.
                </p>
              </CardBody>
              <CardFooter>
                <div className="flex gap-2">
                  <Button size="sm" color="primary" variant="flat">Follow</Button>
                  <Button size="sm" variant="light">Message</Button>
                </div>
              </CardFooter>
            </Card>

            <Card variant="bordered" isHoverable>
              <CardHeader>
                <div className="flex justify-between items-start w-full">
                  <div>
                    <p className="text-sm font-semibold text-default-900">NR UI Kit</p>
                    <p className="text-xs text-default-500">React Component Library</p>
                  </div>
                  <Chip color="primary" size="sm" variant="flat">New</Chip>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600">
                  A complete React UI component library with 19+ components.
                </p>
              </CardBody>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1 text-default-500">
                    <Star size={14} />
                    <span className="text-xs">4.9</span>
                  </div>
                  <Button size="sm" variant="bordered" startContent={<Download size={14} />}>Install</Button>
                </div>
              </CardFooter>
            </Card>

            <Card variant="shadow" isPressable isHoverable>
              <CardBody>
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mx-auto mb-3">
                    <Shield size={24} />
                  </div>
                  <p className="text-sm font-semibold text-default-900 mb-1">Security First</p>
                  <p className="text-xs text-default-500">Built with TypeScript for type-safe development experience.</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* ━━━ TABLE ━━━ */}
        <Section title="Table">
          <Card variant="shadow">
            <CardBody>
              <Table
                columns={[
                  { key: "name", label: "Name", sortable: true },
                  { key: "role", label: "Role", sortable: true },
                  { key: "email", label: "Email" },
                  {
                    key: "status",
                    label: "Status",
                    render: (row) => (
                      <Chip
                        size="sm"
                        variant="flat"
                        color={row.status === "Active" ? "success" : row.status === "Paused" ? "warning" : "danger"}
                      >
                        {row.status as string}
                      </Chip>
                    ),
                  },
                  {
                    key: "actions",
                    label: "Actions",
                    render: () => (
                      <div className="flex gap-1">
                        <Tooltip content="Edit">
                          <Button variant="light" size="sm" isIconOnly><Edit3 size={14} /></Button>
                        </Tooltip>
                        <Tooltip content="Copy">
                          <Button variant="light" size="sm" isIconOnly><Copy size={14} /></Button>
                        </Tooltip>
                        <Tooltip content="Delete" color="danger">
                          <Button variant="light" size="sm" color="danger" isIconOnly><Trash2 size={14} /></Button>
                        </Tooltip>
                      </div>
                    ),
                  },
                ]}
                rows={[
                  { id: "1", name: "Nazirov Rafiqjon", role: "CEO", email: "rafiq@nr.dev", status: "Active" },
                  { id: "2", name: "Alisher Karimov", role: "CTO", email: "alisher@nr.dev", status: "Active" },
                  { id: "3", name: "Madina Rahimova", role: "Designer", email: "madina@nr.dev", status: "Paused" },
                  { id: "4", name: "Sardor Numonov", role: "Developer", email: "sardor@nr.dev", status: "Active" },
                  { id: "5", name: "Dilshod Toshmatov", role: "QA", email: "dilshod@nr.dev", status: "Vacation" },
                ]}
                keyField="id"
                selectionMode="multiple"
                selectedKeys={selectedRows}
                onSelectionChange={setSelectedRows}
                isStriped
              />
            </CardBody>
          </Card>
        </Section>

        {/* ━━━ ACCORDION ━━━ */}
        <Section title="Accordion">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-default-400 mb-2">Shadow variant</p>
              <Accordion variant="shadow">
                <AccordionItem title="What is NR UI?" subtitle="Learn about NR UI">
                  <p className="text-sm text-default-600">NR UI is a beautiful React component library, built with TypeScript and Tailwind CSS.</p>
                </AccordionItem>
                <AccordionItem title="How to install?" subtitle="Installation guide">
                  <p className="text-sm text-default-600">Run <code className="bg-default-100 px-1.5 py-0.5 rounded text-xs">npm install nr-ui</code> in your project directory.</p>
                </AccordionItem>
                <AccordionItem title="Is it free?" subtitle="Pricing info">
                  <p className="text-sm text-default-600">Yes! NR UI is completely free and open source under the MIT license.</p>
                </AccordionItem>
              </Accordion>
            </div>
            <div>
              <p className="text-xs text-default-400 mb-2">Bordered variant</p>
              <Accordion variant="bordered" selectionMode="multiple">
                <AccordionItem title="Features" startContent={<Zap size={18} className="text-primary-500" />}>
                  <p className="text-sm text-default-600">19+ components, TypeScript support, Tailwind CSS, dark mode, animations.</p>
                </AccordionItem>
                <AccordionItem title="Customization" startContent={<Settings size={18} className="text-warning-500" />}>
                  <p className="text-sm text-default-600">Easily customize colors, sizes, radius and more through props.</p>
                </AccordionItem>
                <AccordionItem title="Accessibility" startContent={<Shield size={18} className="text-success-500" />}>
                  <p className="text-sm text-default-600">Built with WAI-ARIA standards for keyboard navigation and screen readers.</p>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </Section>

        {/* ━━━ DROPDOWN ━━━ */}
        <Section title="Dropdown">
          <div className="flex flex-wrap gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" endContent={<ChevronDown size={14} />}>Actions</Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection title="Actions">
                  <DropdownItem startContent={<Edit3 size={14} />}>Edit</DropdownItem>
                  <DropdownItem startContent={<Copy size={14} />}>Duplicate</DropdownItem>
                  <DropdownItem startContent={<Share2 size={14} />}>Share</DropdownItem>
                </DropdownSection>
                <DropdownSection title="Danger zone">
                  <DropdownItem startContent={<Trash2 size={14} />} color="danger">Delete</DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" endContent={<ChevronDown size={14} />}>Menu</Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem startContent={<User size={14} />} description="View your profile">Profile</DropdownItem>
                <DropdownItem startContent={<Settings size={14} />} description="Manage settings">Settings</DropdownItem>
                <DropdownItem startContent={<Bookmark size={14} />}>Bookmarks</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Section>

        {/* ━━━ MODAL ━━━ */}
        <Section title="Modal">
          <div className="flex gap-3">
            <Button color="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
          </div>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} backdrop="blur">
            <ModalContent>
              <ModalHeader>Welcome to NR UI</ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-600">
                  This is a modal dialog built with NR UI components. It supports backdrop blur,
                  multiple sizes, placements, and smooth animations.
                </p>
                <Input label="Your Name" variant="bordered" placeholder="Enter your name" />
                <Input label="Email" variant="bordered" placeholder="you@example.com" startContent={<Mail size={14} className="text-default-400" />} />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button color="primary" onClick={() => setModalOpen(false)}>Submit</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Section>

        {/* ━━━ SPINNER & PROGRESS ━━━ */}
        <Section title="Spinner & Progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SubSection title="Spinner">
                <div className="flex flex-wrap items-end gap-6">
                  <Spinner size="sm" />
                  <Spinner size="md" color="primary" />
                  <Spinner size="lg" color="success" />
                  <Spinner color="warning" label="Loading..." />
                  <Spinner color="danger" size="sm" label="Please wait" />
                </div>
              </SubSection>
            </div>
            <div>
              <SubSection title="Progress">
                <div className="space-y-4">
                  <Progress value={progress} color="primary" label="Upload" showValueLabel />
                  <Progress value={45} color="success" size="sm" />
                  <Progress value={80} color="warning" size="lg" isStriped showValueLabel />
                  <Progress isIndeterminate color="secondary" label="Processing..." size="sm" />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="flat" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
                    <Button size="sm" variant="flat" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
                  </div>
                </div>
              </SubSection>
            </div>
          </div>
        </Section>

        {/* ━━━ DIVIDER ━━━ */}
        <Section title="Divider">
          <div className="flex items-center gap-4 h-10">
            <span className="text-sm text-default-600">Section A</span>
            <Divider orientation="vertical" />
            <span className="text-sm text-default-600">Section B</span>
            <Divider orientation="vertical" />
            <span className="text-sm text-default-600">Section C</span>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center py-8 text-sm text-default-400">
          <p>NR UI v1.0.0 — Built with React + TypeScript + Tailwind CSS</p>
          <p className="mt-1">19 components • Pro-grade design • Open Source</p>
        </div>
      </div>
    </div>
  );
}
