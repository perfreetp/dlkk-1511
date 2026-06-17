
import { useState, useMemo } from "react";
import {
  PieChart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  Calendar,
  User,
  ChevronRight,
  Signature,
  Check,
  X,
  FileCheck,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader, Checkbox } from "@/components/FormFields";
import {
  TimelineItem as TTimelineItem,
  ChecklistItem as TChecklistItem,
  daysUntil,
} from "@/types";
import { cn } from "@/components/Layout";

const NOTIFY_STYLE: Record<
  "missing" | "error" | "deadline" | "info",
  { color: string; Icon: any; label: string }
> = {
  missing: { color: "warning", Icon: AlertTriangle, label: "缺项" },
  error: { color: "danger", Icon: AlertCircle, label: "错误" },
  deadline: { color: "primary", Icon: Clock, label: "倒计时" },
  info: { color: "slate", Icon: Info, label: "通知" },
};

const TIMELINE_ICON: Record<
  TTimelineItem["type"],
  { bg: string; fg: string; Icon: any }
> = {
  info: { bg: "bg-slate-100", fg: "text-slate-600", Icon: Info },
  success: { bg: "bg-success-100", fg: "text-success-600", Icon: CheckCircle2 },
  warning: { bg: "bg-warning-100", fg: "text-warning-600", Icon: AlertTriangle },
  error: { bg: "bg-danger-100", fg: "text-danger-600", Icon: AlertCircle },
};

export default function ProgressPage() {
  const {
    progress,
    notifications,
    checklist,
    timeline,
    toggleChecklistItem,
    submitInspection,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"checklist" | "timeline">("checklist");

  const checklistStats = useMemo(() => {
    const total = checklist.length;
    const required = checklist.filter((c) => c.required);
    const checked = checklist.filter((c) => c.checked);
    const requiredChecked = required.filter((c) => c.checked).length;
    const allDone = required.length === requiredChecked;
    return {
      total,
      requiredTotal: required.length,
      checked: checked.length,
      requiredChecked,
      allDone,
      percent: required.length ? Math.round((requiredChecked / required.length) * 100) : 0,
    };
  }, [checklist]);

  const daysLeft = daysUntil(progress.submissionDeadline);

  const handleSubmit = () => {
    if (!checklistStats.allDone) {
      alert("请先完成所有必填项的审核确认！");
      return;
    }
    if (confirm("确认正式向教育局提交年检申报？提交后将无法直接修改。")) {
      submitInspection();
      alert("提交成功！请等待教育局审查。");
    }
  };

  const NotificationItemView = ({
    n,
    idx,
  }: {
    n: (typeof notifications)[number];
    idx: number;
  }) => {
    const style = NOTIFY_STYLE[n.type];
    const Icon = style.Icon;
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
          n.read
            ? "border-slate-200 bg-white"
            : "border-primary-200 bg-primary-50/30 shadow-card"
        )}
        style={{ animation: `fade-in-up 0.4s ease-out ${idx * 40}ms both` }}
      >
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-card",
            style.color === "primary" && "bg-primary-100 text-primary-600",
            style.color === "danger" && "bg-danger-100 text-danger-600",
            style.color === "warning" && "bg-warning-100 text-warning-600",
            style.color === "slate" && "bg-slate-100 text-slate-600"
          )}
        >
          <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "badge border",
                style.color === "primary" && "bg-primary-50 text-primary-700 border-primary-200",
                style.color === "danger" && "bg-danger-50 text-danger-700 border-danger-200",
                style.color === "warning" && "bg-warning-50 text-warning-700 border-warning-200",
                style.color === "slate" && "bg-slate-50 text-slate-600 border-slate-200"
              )}
            >
              {style.label}
            </span>
            {!n.read && (
              <span className="badge bg-primary-600 text-white animate-pulse">未读</span>
            )}
            <span className="text-[11px] text-slate-400 ml-auto">{n.createdAt}</span>
          </div>
          <div className="mt-1 text-sm font-medium text-slate-800">{n.title}</div>
          <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{n.message}</p>
          {n.deadline && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-warning-600">
              <Calendar className="w-3.5 h-3.5" />
              截止日期：{n.deadline}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ChecklistItemView = ({
    item,
    idx,
  }: {
    item: TChecklistItem;
    idx: number;
  }) => (
    <div
      className={cn(
        "p-4 rounded-xl border transition-all duration-200",
        item.checked
          ? "border-success-200 bg-success-50/40"
          : item.required
          ? "border-warning-200 bg-warning-50/30"
          : "border-slate-200 bg-white"
      )}
      style={{ animation: `fade-in-up 0.4s ease-out ${idx * 40}ms both` }}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5 shrink-0">
          <Checkbox
            checked={item.checked}
            onChange={() => toggleChecklistItem(item.id)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800 leading-relaxed">
              {item.content}
            </span>
            {item.required ? (
              <span className="badge bg-danger-50 text-danger-700 border border-danger-200">
                必选
              </span>
            ) : (
              <span className="badge bg-slate-50 text-slate-600 border border-slate-200">
                可选
              </span>
            )}
            {item.checked && (
              <span className="badge bg-success-50 text-success-700 border border-success-200">
                <Check className="w-3 h-3 mr-0.5" />
                已确认
              </span>
            )}
          </div>
          {item.remark && (
            <p className="mt-2 text-xs text-warning-700 bg-warning-100/70 border border-warning-200 rounded-lg px-3 py-2 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1 align-middle" />
              {item.remark}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<PieChart className="w-6 h-6" strokeWidth={2} />}
        title="申报进度中心"
        subtitle="全面掌握年检申报各阶段进度，完成校内审核清单并由负责人确认后，即可正式向教育局提交申报。"
        steps={progress.stageNames.map((name, i) => ({
          label: name,
          status: progress.stageStatuses[i],
        }))}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6 animate-fade-in-up stagger-1">
            <div className="text-center">
              <div className="relative w-44 h-44 mx-auto">
                <svg viewBox="0 0 200 200" className="-rotate-90 w-full h-full">
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#ringGrad)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={
                      2 * Math.PI * 80 * (1 - progress.overallPercentage / 100)
                    }
                    className="transition-all duration-1000"
                    style={{ filter: "drop-shadow(0 2px 6px rgba(37,99,235,0.3))" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-mono font-bold text-5xl text-slate-900 tracking-tight">
                    {progress.overallPercentage}
                    <span className="text-2xl text-slate-400">%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">总体进度</div>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center justify-between text-sm px-1">
                  <span className="text-slate-600">当前阶段</span>
                  <span className="font-medium text-primary-700">
                    {progress.stageNames[progress.currentStage - 1]}
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between text-sm px-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    截止日期
                  </span>
                  <span
                    className={cn(
                      "font-mono font-bold",
                      daysLeft <= 7 ? "text-danger-600" : "text-success-700"
                    )}
                  >
                    {progress.submissionDeadline}
                    <span className="text-xs font-normal ml-1 text-slate-500">
                      (剩 {daysLeft} 天)
                    </span>
                  </span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between text-sm px-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    当前角色
                  </span>
                  <span className="font-medium text-slate-700">
                    李经办（年检经办人）
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden animate-fade-in-up stagger-2">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="font-serif font-semibold text-slate-800 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning-600" />
                提醒事项
                <span className="badge bg-danger-500 text-white ml-1">
                  {notifications.filter((n) => !n.read).length}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-2.5 max-h-[380px] overflow-y-auto scrollbar-thin">
              {notifications.map((n, i) => (
                <NotificationItemView key={n.id} n={n} idx={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden animate-fade-in-up stagger-1">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center">
                  <Signature className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-serif font-semibold text-slate-800">
                    校内审核清单
                  </div>
                  <div className="text-xs text-slate-500">
                    请由校长/举办者逐项确认，所有必选项勾选后方可提交
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <svg viewBox="0 0 36 36" className="-rotate-90 w-full h-full">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={checklistStats.allDone ? "#0d9488" : "#2563eb"}
                      strokeWidth="3"
                      strokeDasharray={`${checklistStats.percent}, 100`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 font-mono">
                    {checklistStats.percent}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">已确认 / 必填</div>
                  <div className="font-mono font-bold text-lg">
                    <span
                      className={
                        checklistStats.allDone
                          ? "text-success-700"
                          : "text-primary-700"
                      }
                    >
                      {checklistStats.requiredChecked}
                    </span>
                    <span className="text-slate-400">/{checklistStats.requiredTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-slate-100 px-3">
              {(
                [
                  { key: "checklist", label: "审核清单", icon: FileCheck },
                  { key: "timeline", label: "操作时间轴", icon: Clock },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                      active
                        ? "text-primary-700 border-primary-600"
                        : "text-slate-500 border-transparent hover:text-slate-700"
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="p-5 max-h-[640px] overflow-y-auto scrollbar-thin">
              {activeTab === "checklist" ? (
                <div className="space-y-3">
                  {checklist.map((c, i) => (
                    <ChecklistItemView key={c.id} item={c} idx={i} />
                  ))}
                </div>
              ) : (
                <div className="relative pl-6">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-200 via-success-200 to-slate-200" />
                  <div className="space-y-5">
                    {[...timeline].reverse().map((t, i) => {
                      const cfg = TIMELINE_ICON[t.type];
                      const Icon = cfg.Icon;
                      return (
                        <div
                          key={t.id}
                          className="relative"
                          style={{
                            animation: `fade-in-up 0.4s ease-out ${i * 50}ms both`,
                          }}
                        >
                          <div
                            className={cn(
                              "absolute -left-6 w-8 h-8 rounded-full flex items-center justify-center shadow-card border-2 border-white",
                              cfg.bg,
                              cfg.fg
                            )}
                          >
                            <Icon className="w-4 h-4" strokeWidth={2.2} />
                          </div>
                          <div className="ml-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-card transition-all duration-200">
                            <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                              <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                {t.action}
                                <ChevronRight className="w-4 h-4 text-primary-500" />
                                <span className="text-slate-600 font-normal">
                                  {t.detail}
                                </span>
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                                {t.time}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              操作人：{t.operator}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-gradient-to-r from-primary-50/50 via-white to-success-50/50 flex items-center justify-between gap-4 rounded-b-xl">
              <div className="text-xs text-slate-500 max-w-sm">
                {checklistStats.allDone ? (
                  <span className="text-success-700 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    所有必选项已完成确认，可以正式提交申报。
                  </span>
                ) : (
                  <span className="text-warning-700 flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    还有 {checklistStats.requiredTotal - checklistStats.requiredChecked}{" "}
                    项必填确认未完成，暂不可提交。
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="btn-secondary">暂存</button>
                <button
                  disabled={!checklistStats.allDone}
                  onClick={handleSubmit}
                  className={cn(
                    "btn-success px-6 py-2.5",
                    !checklistStats.allDone && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <Signature className="w-4 h-4" strokeWidth={2} />
                  确认并提交申报
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
