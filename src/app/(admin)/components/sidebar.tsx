import type { ComponentType } from "react";
import {
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

interface SidebarProps {
  activePath?: string;
}

const primaryItems: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Students", href: "/students", icon: Users },
  { label: "Tutor", href: "/tutor", icon: UserRound },
];

const secondaryItems: SidebarNavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Log out", href: "/logout", icon: LogOut },
  { label: "Help", href: "/help", icon: HelpCircle },
];

const ItemLink = ({
  item,
  isActive,
}: {
  item: SidebarNavItem;
  isActive: boolean;
}) => {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-black transition-colors hover:bg-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33a1cd]",
        isActive && "bg-[#bdd0d2]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span>{item.label}</span>
    </a>
  );
};

export const Sidebar = ({ activePath = "/dashboard" }: SidebarProps): JSX.Element => {
  return (
    <aside className="flex h-full w-full max-w-[220px] flex-col justify-between rounded-2xl bg-[#33a1cd]/10 p-6 backdrop-blur">
      <div>
        <div className="mb-10 flex items-center gap-3 rounded-xl bg-[#f3f3f3] px-4 py-3 text-black shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-semibold text-black">
            IV
          </div>
          <div className="text-lg font-medium">Infoverse</div>
        </div>

        <nav aria-label="Main navigation" className="space-y-2">
          {primaryItems.map((item) => (
            <ItemLink key={item.label} item={item} isActive={activePath === item.href} />
          ))}
        </nav>
      </div>

      <nav aria-label="Secondary navigation" className="space-y-2">
        {secondaryItems.map((item) => (
          <ItemLink key={item.label} item={item} isActive={false} />
        ))}
      </nav>
    </aside>
  );
};
