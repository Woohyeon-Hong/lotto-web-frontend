import {
  Home,
  ShoppingCart,
  FileText,
  Award,
  TrendingUp,
} from "lucide-react";

type Page =
  | "home"
  | "purchase"
  | "purchase-result"
  | "purchase-history"
  | "winning"
  | "statistics";

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({
  currentPage,
  onNavigate,
}: BottomNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTop: "1px solid #E5E5E5",
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 0",
        zIndex: 1000,
      }}
    >
      <NavItem
        icon={
          <Home style={{ width: "24px", height: "24px" }} />
        }
        label="홈"
        isActive={currentPage === "home"}
        onClick={() => onNavigate("home")}
      />
      <NavItem
        icon={
          <ShoppingCart
            style={{ width: "24px", height: "24px" }}
          />
        }
        label="구매"
        isActive={currentPage === "purchase"}
        onClick={() => onNavigate("purchase")}
      />
      <NavItem
        icon={
          <FileText style={{ width: "24px", height: "24px" }} />
        }
        label="내역"
        isActive={currentPage === "purchase-history"}
        onClick={() => onNavigate("purchase-history")}
      />
      <NavItem
        icon={
          <TrendingUp
            style={{ width: "24px", height: "24px" }}
          />
        }
        label="통계"
        isActive={currentPage === "statistics"}
        onClick={() => onNavigate("statistics")}
      />
    </nav>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({
  icon,
  label,
  isActive,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: 0,
        transition: "all 0.2s",
      }}
    >
      {icon}
      <span
        style={{
          fontSize: "0.6875rem",
          color: isActive
            ? "var(--color-baemin-primary)"
            : "var(--color-text-tertiary)",
          fontWeight: isActive ? "600" : "400",
        }}
      >
        {label}
      </span>
    </button>
  );
}