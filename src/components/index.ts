import { withSkeleton } from "./skeletonState";

// Every visual component takes skeleton={true}: it shows its own loading skeleton while data loads
// Forms
import { Button as ButtonBase, ButtonGroup as ButtonGroupBase } from "./Button";
export const Button = withSkeleton(ButtonBase);
export const ButtonGroup = withSkeleton(ButtonGroupBase);
import { Input as InputBase } from "./Input";
export const Input = withSkeleton(InputBase);
import { Label as LabelBase } from "./Label";
export const Label = withSkeleton(LabelBase);
export type { LabelProps } from "./Label";
import { Form as FormBase } from "./Form";
export const Form = withSkeleton(FormBase);
export type { FormProps } from "./Form";
export { readFormValues, useFieldDefaults } from "./formContext";
export type { FormValues, NecessityIndicator, FieldDefaults } from "./formContext";
import { PhoneInput as PhoneInputBase } from "./PhoneInput";
export const PhoneInput = withSkeleton(PhoneInputBase);
export type { PhoneInputProps, PhoneValueInfo } from "./PhoneInput";
export { PHONE_COUNTRIES, formatPhone, getPhoneCountry, detectPhoneCountry, isPhoneComplete } from "./phoneMask";
export type { PhoneCountry } from "./phoneMask";
import { AmountInput as AmountInputBase } from "./AmountInput";
export const AmountInput = withSkeleton(AmountInputBase);
export type { AmountInputProps, AmountValueInfo } from "./AmountInput";
export { amountToWords, numberToWords, formatAmount } from "./amountWords";
export type { AmountCurrency, AmountWordsOptions } from "./amountWords";
import { Textarea as TextareaBase } from "./Textarea";
export const Textarea = withSkeleton(TextareaBase);
import { Checkbox as CheckboxBase, CheckboxGroup as CheckboxGroupBase } from "./Checkbox";
export const Checkbox = withSkeleton(CheckboxBase);
export const CheckboxGroup = withSkeleton(CheckboxGroupBase);
import { RadioGroup as RadioGroupBase, Radio as RadioBase } from "./Radio";
export const RadioGroup = withSkeleton(RadioGroupBase);
export const Radio = withSkeleton(RadioBase);
import { Switch as SwitchBase } from "./Switch";
export const Switch = withSkeleton(SwitchBase);
import { Select as SelectBase } from "./Select";
export const Select = withSkeleton(SelectBase);
export type { SelectItemData } from "./Select";
import { FileUpload as FileUploadBase } from "./FileUpload";
export const FileUpload = withSkeleton(FileUploadBase);
import { Rating as RatingBase } from "./Rating";
export const Rating = withSkeleton(RatingBase);

// Data display
import { Card as CardBase, CardHeader as CardHeaderBase, CardBody as CardBodyBase, CardFooter as CardFooterBase, CardMedia as CardMediaBase } from "./Card";
export const Card = withSkeleton(CardBase);
export const CardHeader = withSkeleton(CardHeaderBase);
export const CardBody = withSkeleton(CardBodyBase);
export const CardFooter = withSkeleton(CardFooterBase);
export const CardMedia = withSkeleton(CardMediaBase);
export { Table } from "./Table";
export type { TableColumn, SortDescriptor } from "./Table";
import { Tabs as TabsBase } from "./Tabs";
export const Tabs = withSkeleton(TabsBase);
export type { TabItem } from "./Tabs";
import { Avatar as AvatarBase, AvatarGroup as AvatarGroupBase } from "./Avatar";
export const Avatar = withSkeleton(AvatarBase);
export const AvatarGroup = withSkeleton(AvatarGroupBase);
import { Badge as BadgeBase } from "./Badge";
export const Badge = withSkeleton(BadgeBase);
import { Chip as ChipBase } from "./Chip";
export const Chip = withSkeleton(ChipBase);
import { Divider as DividerBase } from "./Divider";
export const Divider = withSkeleton(DividerBase);
export { Skeleton } from "./Skeleton";
import { Kbd as KbdBase } from "./Kbd";
export const Kbd = withSkeleton(KbdBase);
export type { KbdKey } from "./Kbd";
import { StatCard as StatCardBase, Sparkline as SparklineBase } from "./StatCard";
export const StatCard = withSkeleton(StatCardBase);
export const Sparkline = withSkeleton(SparklineBase);
import { Timeline as TimelineBase } from "./Timeline";
export const Timeline = withSkeleton(TimelineBase);
export type { TimelineItemData } from "./Timeline";

// Charts
import { LineChart as LineChartBase, AreaChart as AreaChartBase } from "./LineChart";
export const LineChart = withSkeleton(LineChartBase);
export const AreaChart = withSkeleton(AreaChartBase);
export type { LineChartProps, AreaChartProps } from "./LineChart";
import { BarChart as BarChartBase } from "./BarChart";
export const BarChart = withSkeleton(BarChartBase);
export type { BarChartProps } from "./BarChart";
import { PieChart as PieChartBase } from "./PieChart";
export const PieChart = withSkeleton(PieChartBase);
export type { PieChartProps, PieSlice } from "./PieChart";
export { CHART_COLORS, formatCompact } from "./chartUtils";
export type { ChartColor, ChartSeries, ChartDatum } from "./chartUtils";

// Feedback
import { Alert as AlertBase } from "./Alert";
export const Alert = withSkeleton(AlertBase);
import { Spinner as SpinnerBase } from "./Spinner";
export const Spinner = withSkeleton(SpinnerBase);
import { Progress as ProgressBase, CircularProgress as CircularProgressBase } from "./Progress";
export const Progress = withSkeleton(ProgressBase);
export const CircularProgress = withSkeleton(CircularProgressBase);
export { ToastProvider, useToast } from "./Toast";
export type { ToastOptions } from "./Toast";

// Overlays
export { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "./Modal";
import { Tooltip as TooltipBase } from "./Tooltip";
export const Tooltip = withSkeleton(TooltipBase);
export { PopoverTrigger, PopoverContent } from "./Popover";
import { Popover as PopoverBase } from "./Popover";
export const Popover = withSkeleton(PopoverBase);
export { DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from "./Dropdown";
import { Dropdown as DropdownBase } from "./Dropdown";
export const Dropdown = withSkeleton(DropdownBase);

// Navigation
export { NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "./Navbar";
import { Navbar as NavbarBase } from "./Navbar";
export const Navbar = withSkeleton(NavbarBase);
export { SidebarSection, SidebarItem } from "./Sidebar";
import { Sidebar as SidebarBase } from "./Sidebar";
export const Sidebar = withSkeleton(SidebarBase);
export { AccordionItem } from "./Accordion";
import { Accordion as AccordionBase } from "./Accordion";
export const Accordion = withSkeleton(AccordionBase);
import { Pagination as PaginationBase } from "./Pagination";
export const Pagination = withSkeleton(PaginationBase);
import { Stepper as StepperBase } from "./Stepper";
export const Stepper = withSkeleton(StepperBase);
export type { StepItem } from "./Stepper";

// Blocks
import { PricingCard as PricingCardBase, BillingToggle as BillingToggleBase } from "./Pricing";
export const PricingCard = withSkeleton(PricingCardBase);
export const BillingToggle = withSkeleton(BillingToggleBase);
export type { BillingPeriod, PricingFeature } from "./Pricing";
import { ChatContainer as ChatContainerBase, ChatMessage as ChatMessageBase, PromptInput as PromptInputBase } from "./Chat";
export const ChatContainer = withSkeleton(ChatContainerBase);
export const ChatMessage = withSkeleton(ChatMessageBase);
export const PromptInput = withSkeleton(PromptInputBase);

// Skeleton state
export { useSkeleton, SkeletonScope } from "./skeletonState";

// Localization
export { LocaleProvider } from "./LocaleProvider";
export type { LocaleProviderProps } from "./LocaleProvider";
export { useLocale, NR_MESSAGES } from "./locale";
export type { NRLocale, NRMessages } from "./locale";

// Responsive & layout
export { ResponsiveProvider, Show, Hide } from "./Responsive";
export type { ResponsiveProviderProps, ShowProps, HideProps } from "./Responsive";
import { Container as ContainerBase, Stack as StackBase, Grid as GridBase, GridItem as GridItemBase } from "./Layout";
export const Container = withSkeleton(ContainerBase);
export const Stack = withSkeleton(StackBase);
export const Grid = withSkeleton(GridBase);
export const GridItem = withSkeleton(GridItemBase);
export type { ContainerProps, StackProps, GridProps, GridItemProps } from "./Layout";
export { useResponsive, useBreakpoint, useBreakpointMatch, resolveBreakpoints, breakpointQuery, BREAKPOINTS, BREAKPOINT_INFO, SPACE_SCALE } from "./breakpoints";
export type { Breakpoint, ResponsiveProp, ResponsiveValue, Space } from "./breakpoints";
