
import { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Building2,
  Users,
  GraduationCap,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Circle,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader, FormField, Input, Select, TextArea, ToggleSwitch } from "@/components/FormFields";
import { SCHOOL_STAGE_OPTIONS, IndicatorField as TIndicatorField, daysUntil } from "@/types";
import { cn } from "@/components/Layout";

const CATEGORY_CONFIG = [
  { id: "c1", name: "办学条件", icon: Building2, color: "primary" },
  { id: "c2", name: "师资队伍", icon: Users, color: "success" },
  { id: "c3", name: "教育教学", icon: GraduationCap, color: "warning" },
  { id: "c4", name: "财务管理", icon: Wallet, color: "violet" },
  { id: "c5", name: "安全管理", icon: ShieldCheck, color: "danger" },
];

const CATEGORY_BADGE: Record<string, string> = {
  c1: "bg-primary-50 text-primary-700 border-primary-200",
  c2: "bg-success-50 text-success-700 border-success-200",
  c3: "bg-warning-50 text-warning-700 border-warning-200",
  c4: "bg-violet-50 text-violet-700 border-violet-200",
  c5: "bg-danger-50 text-danger-700 border-danger-200",
};

const CATEGORY_DOT: Record<string, string> = {
  c1: "bg-primary-500",
  c2: "bg-success-500",
  c3: "bg-warning-500",
  c4: "bg-violet-500",
  c5: "bg-danger-500",
};

export default function IndicatorsPage() {
  const {
    indicatorCategories,
    indicatorFields,
    currentStage,
    setCurrentStage,
    updateIndicatorField,
  } = useAppStore();

  const [activeCategory, setActiveCategory] = useState("c1");
  const fields = indicatorFields[currentStage];

  const stats = useMemo(() => {
    const total = fields.length;
    let filled = 0;
    let errors = 0;
    for (const f of fields) {
      const hasValue =
        f.value !== undefined &&
        f.value !== null &&
        f.value !== "" &&
        f.value !== 0
          ? String(f.value).trim().length > 0
          : false;
      if (hasValue) filled++;
      if (f.required && !hasValue) errors++;
      if (f.error) errors++;
    }
    return {
      total,
      filled,
      errors,
      empty: total - filled - errors,
      percent: Math.round((filled / total) * 100),
    };
  }, [fields]);

  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; filled: number; errors: number }> = {};
    for (const cat of CATEGORY_CONFIG) {
      const catFields = fields.filter((f) => f.categoryId === cat.id);
      let filled = 0;
      let errors = 0;
      for (const f of catFields) {
        const hasValue =
          f.value !== undefined &&
          f.value !== null &&
          f.value !== "" &&
          f.value !== 0
            ? String(f.value).trim().length > 0
            : false;
        if (hasValue) filled++;
        if ((f.required && !hasValue) || f.error) errors++;
      }
      map[cat.id] = { total: catFields.length, filled, errors };
    }
    return map;
  }, [fields]);

  const activeFields = fields.filter((f) => f.categoryId === activeCategory);
  const activeCatName = CATEGORY_CONFIG.find((c) => c.id === activeCategory)?.name;

  const renderField = (field: TIndicatorField) => {
    const commonProps = {
      value: field.value ?? "",
      placeholder: field.placeholder,
      onChange: (e: any) =>
        updateIndicatorField(
          field.id,
          field.type === "number" ? Number(e.target.value) || null : e.target.value
        ),
    };

    switch (field.type) {
      case "text":
        return <Input {...commonProps} />;
      case "number":
        return (
          <Input
            {...commonProps}
            type="number"
            unit={field.unit}
            className="font-mono"
          />
        );
      case "textarea":
        return <TextArea {...commonProps} rows={3} />;
      case "select":
        return (
          <Select {...commonProps}>
            <option value="">请选择...</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        );
      case "date":
        return <Input {...commonProps} type="date" />;
      case "boolean":
        return (
          <div className="pt-1">
            <ToggleSwitch
              checked={!!field.value}
              onChange={(v) => updateIndicatorField(field.id, v)}
            />
          </div>
        );
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<FileSpreadsheet className="w-6 h-6" strokeWidth={2} />}
        title="年检指标填报"
        subtitle="根据学校所属学段填写相应年检指标，分为办学条件、师资队伍、教育教学、财务管理、安全管理五大类。系统将自动校验数据合理性。"
        extra={
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="text-[11px] text-slate-500">填报完成度</div>
              <div className="font-mono font-bold text-lg text-primary-700">
                {stats.percent}%
              </div>
            </div>
            <div className="w-20 h-20">
              <svg viewBox="0 0 36 36" className="-rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeDasharray={`${stats.percent}, 100`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        }
        steps={[
          { label: "基础信息", status: "completed" },
          { label: "指标填报", status: "current" },
          { label: "材料上传", status: "pending" },
          { label: "校内审核", status: "pending" },
          { label: "教育局审查", status: "pending" },
          { label: "年检完成", status: "pending" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-5">
          <div className="card p-4 animate-fade-in-up stagger-1">
            <div className="text-xs text-slate-500 mb-2">当前办学学段</div>
            <Select value={currentStage} onChange={(e) => setCurrentStage(e.target.value as any)}>
              {SCHOOL_STAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
              切换学段将自动加载对应年检指标表单，已填写内容将保留。
            </p>
          </div>

          <div className="card overflow-hidden animate-fade-in-up stagger-2">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="font-serif font-semibold text-slate-800 text-sm">
                指标分类
              </div>
            </div>
            <nav className="p-2">
              {CATEGORY_CONFIG.map((cat) => {
                const Icon = cat.icon;
                const s = categoryStats[cat.id];
                const isActive = activeCategory === cat.id;
                const isDone = s.errors === 0 && s.total === s.filled;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left",
                      isActive
                        ? "bg-primary-50 shadow-card"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0",
                        isActive
                          ? "bg-primary-600 text-white shadow-card"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}
                    >
                      <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isActive
                              ? "text-primary-700"
                              : "text-slate-700"
                          )}
                        >
                          {cat.name}
                        </span>
                        {isDone ? (
                          <CheckCircle2
                            className="w-4 h-4 text-success-600 shrink-0"
                            strokeWidth={2.2}
                          />
                        ) : s.errors > 0 ? (
                          <span className="badge bg-danger-100 text-danger-700 !text-[10px]">
                            {s.errors} 项
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              s.errors > 0 ? "bg-danger-500" : CATEGORY_DOT[cat.id]
                            )}
                            style={{
                              width: `${s.total ? (s.filled / s.total) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono shrink-0">
                          {s.filled}/{s.total}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="card p-4 animate-fade-in-up stagger-3">
            <div className="text-xs text-slate-500 mb-3">填报情况汇总</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-success-600" />
                  已完成
                </span>
                <span className="font-mono font-medium text-success-700">
                  {stats.filled} 项
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <AlertCircle className="w-4 h-4 text-danger-600" />
                  待修改/必填
                </span>
                <span className="font-mono font-medium text-danger-700">
                  {stats.errors} 项
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <Circle className="w-3 h-3 text-slate-400 fill-slate-200" />
                  待填写
                </span>
                <span className="font-mono font-medium text-slate-500">
                  {stats.empty} 项
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-warning-600">
                <AlertCircle className="w-4 h-4" />
                距填报截止 {daysUntil("2026-06-30")} 天
              </div>
            </div>
          </div>
        </aside>

        <section className="card animate-fade-in-up stagger-2">
          <div className="card-header sticky top-0 bg-white/95 backdrop-blur z-10">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "badge border",
                  CATEGORY_BADGE[activeCategory]
                )}
              >
                {activeCatName}
              </span>
              <span className="text-xs text-slate-500">
                共 {activeFields.length} 项指标
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              {CATEGORY_CONFIG.map((c, i) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      c.id === activeCategory
                        ? "bg-primary-50 text-primary-700 shadow-card"
                        : "hover:bg-slate-100 text-slate-400"
                    )}
                    title={c.name}
                  >
                    {i < CATEGORY_CONFIG.length - 1 ? (
                      <div className="flex items-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </button>
                );
              }).reduce((acc: any[], el, i, arr) => {
                acc.push(el);
                if (i < arr.length - 1) {
                  acc.push(
                    <ChevronRight
                      key={`sep-${i}`}
                      className="w-3 h-3 text-slate-300 mx-0.5"
                    />
                  );
                }
                return acc;
              }, [])}
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {activeFields.map((field, idx) => (
                <div
                  key={field.id}
                  className={cn(
                    idx === activeFields.length - 1 &&
                      field.type === "textarea" &&
                      "md:col-span-2"
                  )}
                  style={{
                    animation: `fade-in-up 0.4s ease-out ${idx * 20}ms both`,
                  }}
                >
                  <FormField
                    label={field.label}
                    required={field.required}
                    error={field.error}
                  >
                    {renderField(field)}
                  </FormField>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-xl">
            <button className="btn-ghost">
              <ChevronRight className="w-4 h-4 rotate-180" />
              上一类
            </button>
            <div className="text-xs text-slate-500">
              第 {CATEGORY_CONFIG.findIndex((c) => c.id === activeCategory) + 1}/
              {CATEGORY_CONFIG.length} 类 · 自动保存
            </div>
            <button className="btn-primary">
              下一类
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
