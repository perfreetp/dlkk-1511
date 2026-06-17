
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  Send,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  PlayCircle,
  RotateCcw,
  Calendar,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/FormFields";
import {
  RectificationItem as TRectificationItem,
  RECTIFICATION_STATUS_MAP,
  daysUntil,
  formatDateTime,
} from "@/types";
import { cn } from "@/components/Layout";

const STATUS_FLOW = [
  { value: "pending", label: "待整改", Icon: AlertCircle, next: "in_progress", btn: "开始整改", color: "warning" },
  { value: "in_progress", label: "整改中", Icon: PlayCircle, next: "submitted", btn: "提交整改", color: "primary" },
  { value: "submitted", label: "已提交/待复核", Icon: Clock, next: null, btn: null, color: "blue" },
  { value: "passed", label: "已通过", Icon: CheckCircle2, next: null, btn: null, color: "success" },
  { value: "retry", label: "需再整改", Icon: RotateCcw, next: "in_progress", btn: "重新整改", color: "danger" },
] as const;

function StatusBadge({ status }: { status: TRectificationItem["status"] }) {
  const cfg = RECTIFICATION_STATUS_MAP[status];
  return (
    <span className={cn("badge border", cfg.color, "border-current/10")}>
      {cfg.label}
    </span>
  );
}

function DiffTable({ diffData }: { diffData: NonNullable<TRectificationItem["diffData"]> }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-primary-600" strokeWidth={2} />
        <span className="text-sm font-medium text-slate-700">退回前 vs 修改后 差异对比</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-500 bg-slate-50/50">
            <th className="px-4 py-2 text-left font-medium w-1/4">字段名称</th>
            <th className="px-4 py-2 text-left font-medium w-[30%]">退回前（教育局参考值）</th>
            <th className="px-4 py-2 text-left font-medium w-[30%]">当前填报值</th>
            <th className="px-4 py-2 w-[10%] text-center">状态</th>
          </tr>
        </thead>
        <tbody>
          {diffData.map((d, i) => (
            <tr
              key={i}
              className={cn(
                "border-t border-slate-100",
                d.changed && "bg-danger-50/40"
              )}
            >
              <td className="px-4 py-3 font-medium text-slate-800">{d.field}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "font-mono text-xs px-2 py-0.5 rounded",
                    d.changed
                      ? "bg-danger-100 text-danger-700 line-through"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {d.oldValue}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "font-mono text-xs px-2 py-0.5 rounded",
                    d.changed
                      ? "bg-success-100 text-success-700 underline underline-offset-2 decoration-success-400"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {d.newValue}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {d.changed ? (
                  <span className="badge bg-warning-100 text-warning-700">
                    已变更
                  </span>
                ) : (
                  <CheckCircle2 className="w-4 h-4 mx-auto text-success-500" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CommentThread({ item }: { item: TRectificationItem }) {
  const [input, setInput] = useState("");
  const { addRectificationComment } = useAppStore();

  const handleSend = () => {
    if (!input.trim()) return;
    addRectificationComment(item.id, input.trim());
    setInput("");
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary-600" strokeWidth={2} />
        <span className="text-sm font-medium text-slate-700">
          沟通记录（{item.comments.length}）
        </span>
      </div>
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto scrollbar-thin bg-slate-50/30">
        {item.comments.map((c, i) => {
          const isSchool = c.role === "学校经办人";
          return (
            <div
              key={c.id}
              className={cn("flex gap-2.5", isSchool ? "justify-end" : "justify-start")}
              style={{ animation: `fade-in-up 0.3s ease-out ${i * 30}ms both` }}
            >
              {!isSchool && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                  {c.author[0]}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] space-y-1",
                  isSchool && "items-end flex flex-col"
                )}
              >
                <div
                  className={cn(
                    "text-[11px] flex items-center gap-1.5",
                    isSchool ? "text-slate-500" : "text-slate-500"
                  )}
                >
                  <span className="font-medium">{c.author}</span>
                  <span className="opacity-70">·</span>
                  <span>{c.role}</span>
                  <span className="opacity-70">·</span>
                  <span>{c.createdAt}</span>
                </div>
                <div
                  className={cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-card",
                    isSchool
                      ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-md"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-md"
                  )}
                >
                  {c.content}
                </div>
              </div>
              {isSchool && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                  {c.author[0]}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-slate-200 bg-white flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={2}
          placeholder="输入回复内容，按 Enter 发送，Shift + Enter 换行..."
          className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-primary-400 focus:ring-3 focus:ring-primary-500/15"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="btn-primary !py-2.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          发送
        </button>
      </div>
    </div>
  );
}

function RectificationCard({
  item,
  idx,
}: {
  item: TRectificationItem;
  idx: number;
}) {
  const navigate = useNavigate();
  const { updateRectificationStatus, submitRectificationForReview } = useAppStore();
  const [expanded, setExpanded] = useState(true);
  const daysLeft = daysUntil(item.deadline);
  const currentFlow = STATUS_FLOW.find((s) => s.value === item.status);
  const isUrgent = daysLeft <= 5 && item.status !== "passed";

  const handleNavigate = () => {
    if (!item.relatedPage) return;
    switch (item.relatedPage) {
      case "basic-info":
        navigate("/basic-info");
        break;
      case "indicators":
        navigate("/indicators");
        break;
      case "materials":
        navigate("/materials");
        break;
    }
  };

  return (
    <div
      className={cn(
        "card overflow-hidden transition-all duration-300",
        isUrgent && "border-danger-300 shadow-card-hover"
      )}
      style={{ animation: `fade-in-up 0.5s ease-out ${idx * 60}ms both` }}
    >
      <div
        className={cn(
          "card-header !flex-wrap gap-3",
          isUrgent && "bg-danger-50/30"
        )}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-card",
              item.status === "passed"
                ? "bg-gradient-to-br from-success-500 to-success-600 text-white"
                : isUrgent
                ? "bg-gradient-to-br from-danger-500 to-danger-600 text-white"
                : "bg-gradient-to-br from-primary-500 to-warning-500 text-white"
            )}
          >
            <AlertCircle className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-semibold text-slate-900 text-base leading-snug">
                {item.title}
              </h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                责任人：{item.responsible}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 font-mono font-medium",
                  isUrgent && daysLeft >= 0
                    ? "text-danger-600"
                    : daysLeft < 0
                    ? "text-danger-700 font-bold"
                    : "text-success-600"
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                截止：{item.deadline}
                {daysLeft >= 0 ? `（剩 ${daysLeft} 天）` : `（已逾期 ${-daysLeft} 天）`}
              </span>
              <span>更新：{formatDateTime(item.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.relatedPage && (item.status === "pending" || item.status === "in_progress") && (
            <button
              onClick={handleNavigate}
              className="btn btn-secondary text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              去处理
            </button>
          )}
          {item.status === "in_progress" && (
            <button
              onClick={() => submitRectificationForReview(item.id)}
              className="btn btn-primary text-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              提交复核
            </button>
          )}
          {currentFlow?.btn && (
            <button
              onClick={() =>
                currentFlow.next && updateRectificationStatus(item.id, currentFlow.next)
              }
              className={cn(
                "btn text-xs",
                item.status === "pending" &&
                  "bg-gradient-to-br from-warning-500 to-warning-600 text-white hover:shadow-card-hover",
                item.status === "in_progress" && "btn-primary",
                item.status === "retry" &&
                  "bg-gradient-to-br from-danger-500 to-danger-600 text-white hover:shadow-card-hover"
              )}
            >
              {currentFlow.Icon && <currentFlow.Icon className="w-3.5 h-3.5" />}
              {currentFlow.btn}
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="card-body space-y-5 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-danger-50/40 border border-danger-200">
              <div className="text-xs font-semibold text-danger-700 mb-1.5 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" strokeWidth={2.2} />
                问题描述
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-success-50/50 border border-success-200">
              <div className="text-xs font-semibold text-success-700 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.2} />
                整改建议
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.suggestion}
              </p>
            </div>
          </div>

          {item.diffData && item.diffData.length > 0 && <DiffTable diffData={item.diffData} />}

          <CommentThread item={item} />

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500 mb-2.5 font-medium">
              状态流转进度
            </div>
            <div className="flex items-stretch gap-1 overflow-x-auto scrollbar-thin pb-1">
              {STATUS_FLOW.map((s, i) => {
                const curIdx = STATUS_FLOW.findIndex(
                  (f) => f.value === item.status
                );
                const selfIdx = i;
                const isPassed = selfIdx < curIdx;
                const isCurrent = selfIdx === curIdx;
                return (
                  <div
                    key={s.value}
                    className={cn(
                      "flex-1 flex items-center gap-2 min-w-[120px]",
                      i < STATUS_FLOW.length - 1 && "pr-1"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500",
                          isPassed
                            ? "bg-success-600 text-white shadow-card"
                            : isCurrent
                            ? "bg-primary-600 text-white shadow-glow scale-110"
                            : "bg-slate-200 text-slate-500"
                        )}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                        ) : (
                          <s.Icon className="w-4 h-4" strokeWidth={2.2} />
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-1 text-[10px] font-medium whitespace-nowrap",
                          isPassed
                            ? "text-success-700"
                            : isCurrent
                            ? "text-primary-700"
                            : "text-slate-400"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className="flex-1 h-0.5 mt-4 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <div
                          className={cn(
                            "h-full transition-all duration-700",
                            isPassed
                              ? "w-full bg-success-500"
                              : "w-0 bg-primary-500"
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RectificationPage() {
  const navigate = useNavigate();
  const { rectifications } = useAppStore();
  const [filter, setFilter] = useState<"all" | TRectificationItem["status"]>(
    "all"
  );

  const filtered = useMemo(() => {
    if (filter === "all") return rectifications;
    return rectifications.filter((r) => r.status === filter);
  }, [rectifications, filter]);

  const stats = useMemo(() => {
    const total = rectifications.length;
    const pending = rectifications.filter((r) => r.status === "pending").length;
    const inProgress = rectifications.filter(
      (r) => r.status === "in_progress" || r.status === "retry"
    ).length;
    const passed = rectifications.filter((r) => r.status === "passed").length;
    const submitted = rectifications.filter((r) => r.status === "submitted").length;
    return { total, pending, inProgress, submitted, passed };
  }, [rectifications]);

  const filters: {
    value: typeof filter;
    label: string;
    count: number;
    icon: any;
    color: string;
  }[] = [
    { value: "all", label: "全部", count: stats.total, icon: ClipboardCheck, color: "primary" },
    { value: "pending", label: "待整改", count: stats.pending, icon: AlertCircle, color: "warning" },
    { value: "in_progress", label: "整改中", count: stats.inProgress, icon: PlayCircle, color: "primary" },
    { value: "submitted", label: "已提交/待复核", count: stats.submitted, icon: Clock, color: "blue" },
    { value: "passed", label: "已通过", count: stats.passed, icon: CheckCircle2, color: "success" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ClipboardCheck className="w-6 h-6" strokeWidth={2} />}
        title="整改事项跟踪"
        subtitle="教育局审查后提出的整改意见将在此列出，请逐项落实。支持查看退回前后差异对比、与审查员在线沟通，完成后点击状态流转按钮提交复核。"
        extra={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card !p-3 !border-warning-200 bg-warning-50/30">
              <div className="text-[11px] text-warning-700 font-medium">待整改</div>
              <div className="font-mono font-bold text-2xl text-warning-700">
                {stats.pending}
              </div>
            </div>
            <div className="card !p-3 !border-primary-200 bg-primary-50/30">
              <div className="text-[11px] text-primary-700 font-medium">整改中</div>
              <div className="font-mono font-bold text-2xl text-primary-700">
                {stats.inProgress}
              </div>
            </div>
            <div className="card !p-3 !border-blue-200 bg-blue-50/30">
              <div className="text-[11px] text-blue-700 font-medium">已提交/待复核</div>
              <div className="font-mono font-bold text-2xl text-blue-700">
                {stats.submitted}
              </div>
            </div>
            <div className="card !p-3 !border-success-200 bg-success-50/30">
              <div className="text-[11px] text-success-700 font-medium">已通过</div>
              <div className="font-mono font-bold text-2xl text-success-700">
                {stats.passed}
              </div>
            </div>
          </div>
        }
        steps={[
          { label: "基础信息", status: "completed" },
          { label: "指标填报", status: "completed" },
          { label: "材料上传", status: "completed" },
          { label: "校内审核", status: "completed" },
          { label: "教育局审查", status: "current" },
          { label: "年检完成", status: "pending" },
        ]}
      />

      <div className="card p-2 flex items-center gap-2 overflow-x-auto scrollbar-thin animate-fade-in-up stagger-1">
        {filters.map((f) => {
          const Icon = f.icon;
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                active
                  ? "bg-primary-600 text-white shadow-card"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={2} />
              {f.label}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success-600" />
            </div>
            <div className="font-serif text-lg font-semibold text-slate-800 mb-1">
              暂无整改事项
            </div>
            <p className="text-sm text-slate-500">
              当前筛选条件下没有需要处理的整改事项。
            </p>
          </div>
        ) : (
          filtered.map((r, i) => <RectificationCard key={r.id} item={r} idx={i} />)
        )}
      </div>
    </div>
  );
}

