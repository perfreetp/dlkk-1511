
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Upload,
  ClipboardCheck,
  PieChart,
  FileCheck,
  Bell,
  GraduationCap,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect, useRef } from "react";
import { NotificationItem } from "@/types";
import { daysUntil } from "@/types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { path: "/basic-info", label: "基础信息", icon: LayoutDashboard, index: 0 },
  { path: "/indicators", label: "指标填报", icon: FileSpreadsheet, index: 1 },
  { path: "/materials", label: "材料上传", icon: Upload, index: 2 },
  { path: "/rectification", label: "整改跟踪", icon: ClipboardCheck, index: 3 },
  { path: "/progress", label: "进度中心", icon: PieChart, index: 4 },
  { path: "/receipt", label: "结果回执", icon: FileCheck, index: 5 },
];

const NOTIFICATION_COLORS: Record<NotificationItem["type"], string> = {
  missing: "bg-warning-50 text-warning-700 border-warning-200",
  error: "bg-danger-50 text-danger-700 border-danger-200",
  deadline: "bg-primary-50 text-primary-700 border-primary-200",
  info: "bg-slate-50 text-slate-700 border-slate-200",
};

const NOTIFICATION_ICON: Record<NotificationItem["type"], string> = {
  missing: "缺项",
  error: "错误",
  deadline: "倒计时",
  info: "通知",
};

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 card shadow-paper animate-fade-in z-50 overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="font-serif font-semibold text-slate-800">消息通知</div>
        <button
          onClick={() => markAllNotificationsRead()}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          全部标为已读
        </button>
      </div>
      <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 text-sm">暂无通知消息</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                "px-5 py-3.5 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                !n.read && "bg-primary-50/30"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "badge border shrink-0 mt-0.5",
                    NOTIFICATION_COLORS[n.type]
                  )}
                >
                  {NOTIFICATION_ICON[n.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-slate-800 truncate">
                      {n.title}
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                  <div className="text-[11px] text-slate-400 mt-1.5">{n.createdAt}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { schoolInfo, notifications, progress } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const daysLeft = daysUntil(progress.submissionDeadline);

  const currentIdx = NAV_ITEMS.findIndex((n) => n.path === location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200 no-print">
        <div className="container">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-card">
                <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-serif font-bold text-lg tracking-tight text-slate-900 leading-tight">
                  民办学校年检申报平台
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {schoolInfo.schoolName} · 2025 年度年检
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isPast = item.index < currentIdx;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : isPast
                        ? "text-success-600 hover:bg-slate-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary-600" />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning-50 border border-warning-200">
                <span className="text-[11px] text-warning-600 font-medium">
                  距截止
                </span>
                <span className="font-mono font-bold text-warning-700">{daysLeft}</span>
                <span className="text-[11px] text-warning-600 font-medium">天</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications((v) => !v)}
                  className="relative w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-600" strokeWidth={1.8} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationPanel onClose={() => setShowNotifications(false)} />
                )}
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  李
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-slate-800 leading-tight">
                    李经办
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">年检经办人</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="lg:hidden border-t border-slate-100 bg-white overflow-x-auto scrollbar-thin no-print">
          <div className="container flex items-center gap-1 py-2 min-w-max">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1 container py-6 lg:py-8">
        <div key={location.pathname} className="animate-fade-in-up">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-4 no-print">
        <div className="container text-center text-xs text-slate-400">
          © 2026 民办学校年检申报平台 · 本平台数据由各学校负责，教育主管部门负责最终审核
        </div>
      </footer>
    </div>
  );
}
