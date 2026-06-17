
import { useState, useMemo } from "react";
import {
  FileCheck,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  Award,
  ChevronRight,
  Star,
  Camera,
  BarChart3,
  FolderCheck,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/FormFields";
import {
  INSPECTION_RESULT_MAP,
  SCHOOL_STAGE_OPTIONS,
  InspectionResult,
  formatDate,
  HistoryRecord,
} from "@/types";
import { cn } from "@/components/Layout";

const RESULT_ICON: Record<InspectionResult, any> = {
  passed: CheckCircle2,
  conditional_passed: Star,
  need_rectify: Clock,
  rejected: XCircle,
};

const RESULT_STYLE: Record<
  InspectionResult,
  { gradient: string; ring: string; header: string; text: string }
> = {
  passed: {
    gradient: "from-success-500 to-success-600",
    ring: "ring-success-200",
    header: "from-success-50 via-white to-success-50",
    text: "text-success-700",
  },
  conditional_passed: {
    gradient: "from-warning-500 to-warning-600",
    ring: "ring-warning-200",
    header: "from-warning-50 via-white to-warning-50",
    text: "text-warning-700",
  },
  need_rectify: {
    gradient: "from-primary-500 to-primary-600",
    ring: "ring-primary-200",
    header: "from-primary-50 via-white to-primary-50",
    text: "text-primary-700",
  },
  rejected: {
    gradient: "from-danger-500 to-danger-600",
    ring: "ring-danger-200",
    header: "from-danger-50 via-white to-danger-50",
    text: "text-danger-700",
  },
};

function HistoryCard({ record }: { record: HistoryRecord }) {
  const cfg = INSPECTION_RESULT_MAP[record.result];
  const Icon = RESULT_ICON[record.result];
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-200 hover:shadow-card transition-all duration-200 animate-fade-in-up">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shadow-card shrink-0 text-white bg-gradient-to-br",
          RESULT_STYLE[record.result].gradient
        )}
      >
        <Icon className="w-6 h-6" strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif font-semibold text-slate-900 text-lg">
            {record.year} 年度
          </span>
          <span className={cn("badge border border-current/10", cfg.color)}>
            {cfg.label}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {record.receiptNumber}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            审查日期：{formatDate(record.reviewDate)}
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" strokeWidth={1.8} />
    </div>
  );
}

export default function ReceiptPage() {
  const { receipt, schoolInfo, submissionSnapshot } = useAppStore();
  const [showHistory, setShowHistory] = useState(false);

  const resultCfg = INSPECTION_RESULT_MAP[receipt.result];
  const style = RESULT_STYLE[receipt.result];
  const ResultIcon = RESULT_ICON[receipt.result];

  const stageLabel = useMemo(
    () => SCHOOL_STAGE_OPTIONS.find((s) => s.value === receipt.schoolStage)?.label || "",
    [receipt.schoolStage]
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<FileCheck className="w-6 h-6" strokeWidth={2} />}
        title="年检结果回执"
        subtitle="教育主管部门的审查结论、正式回执及历史记录。支持打印存档。"
        extra={
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="btn-secondary"
            >
              <Printer className="w-4 h-4" strokeWidth={1.8} />
              打印回执
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary"
            >
              <Download className="w-4 h-4" strokeWidth={1.8} />
              下载 PDF
            </button>
          </div>
        }
        steps={[
          { label: "基础信息", status: "completed" },
          { label: "指标填报", status: "completed" },
          { label: "材料上传", status: "completed" },
          { label: "校内审核", status: "completed" },
          { label: "教育局审查", status: "completed" },
          { label: "年检完成", status: "current" },
        ]}
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-slate-200 shadow-paper bg-white animate-fade-in-up",
          "print:shadow-none print:border-0"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-40 bg-gradient-to-r opacity-70",
            style.header
          )}
        />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent blur-2xl" />

        <div className="relative p-8 lg:p-12">
          <div className="flex items-start justify-between gap-6 flex-wrap no-print">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-paper text-white bg-gradient-to-br ring-8",
                  style.gradient,
                  style.ring
                )}
              >
                <ResultIcon className="w-10 h-10" strokeWidth={2} />
              </div>
              <div>
                <div className="text-xs text-slate-500 tracking-widest uppercase">
                  Inspection Result
                </div>
                <div
                  className={cn(
                    "font-serif font-bold text-3xl lg:text-4xl tracking-tight mt-1",
                    style.text
                  )}
                >
                  {resultCfg.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  回执编号：{receipt.receiptNumber}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">{receipt.inspectionYear} 年度</div>
              <div className="font-serif font-bold text-5xl text-slate-900 tracking-tight">
                年检回执
              </div>
              <div className="text-xs text-slate-500 mt-1">Annual Inspection Receipt</div>
            </div>
          </div>

          <div className="print-only mb-8 text-center border-b-2 border-slate-900 pb-6">
            <div className="font-serif font-black text-3xl text-slate-900">
              民办学校年度检查
            </div>
            <div className="font-serif font-bold text-2xl text-slate-800 mt-1">
              结果回执单
            </div>
            <div className="text-xs text-slate-600 mt-3 font-mono">
              回执编号：{receipt.receiptNumber}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm">
            {[
              { label: "学校名称", value: receipt.schoolName, span: true },
              { label: "办学学段", value: stageLabel },
              { label: "统一社会信用代码", value: schoolInfo.unifiedCreditCode, mono: true },
              { label: "办学许可证号", value: receipt.schoolName ? schoolInfo.licenseNumber : "-", mono: true },
              { label: "法人代表", value: schoolInfo.legalPerson },
              { label: "校    长", value: schoolInfo.principal },
              { label: "学校地址", value: schoolInfo.schoolAddress, span: true },
              {
                label: "申报日期",
                value: formatDate(receipt.submissionDate),
                mono: true,
              },
              {
                label: "审查日期",
                value: formatDate(receipt.reviewDate),
                mono: true,
              },
            ].map((f, i) => (
              <div
                key={i}
                className={cn(
                  "flex border-b border-dashed border-slate-200 pb-2.5",
                  f.span && "md:col-span-2"
                )}
              >
                <div className="w-32 shrink-0 text-slate-500 font-medium flex items-center gap-2">
                  {f.label}
                </div>
                <div
                  className={cn(
                    "flex-1 text-slate-800",
                    f.mono && "font-mono tracking-wide"
                  )}
                >
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-2">
              <Award className={cn("w-5 h-5", style.text)} strokeWidth={2} />
              <div className="font-serif font-semibold text-lg text-slate-800">
                年检结论
              </div>
            </div>
            <div
              className={cn(
                "rounded-xl border-2 p-5 lg:p-6",
                receipt.result === "passed" &&
                  "border-success-200 bg-success-50/30",
                receipt.result === "conditional_passed" &&
                  "border-warning-200 bg-warning-50/30",
                receipt.result === "need_rectify" &&
                  "border-primary-200 bg-primary-50/30",
                receipt.result === "rejected" &&
                  "border-danger-200 bg-danger-50/30"
              )}
            >
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3",
                  resultCfg.color,
                  "border border-current/10"
                )}
              >
                <ResultIcon className="w-4 h-4" strokeWidth={2.4} />
                {resultCfg.label.toUpperCase()}
              </div>
              <p className="text-slate-800 leading-loose text-[15px]">
                {receipt.resultDescription}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-600" strokeWidth={2} />
              <div className="font-serif font-semibold text-lg text-slate-800">
                审查意见
              </div>
            </div>
            <div className="rounded-xl border-2 border-slate-200 bg-slate-50/60 p-5 lg:p-6">
              <div className="text-[15px] text-slate-800 leading-loose whitespace-pre-line font-medium">
                {receipt.reviewComments}
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 lg:gap-16 print-only">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-12">学校（盖章）</div>
              <div className="h-0.5 bg-slate-300" />
              <div className="text-xs text-slate-500 mt-2">法定代表人签字：</div>
              <div className="text-xs text-slate-500 mt-1">
                日期：______年____月____日
              </div>
            </div>
            <div className="text-center relative">
              <div className="text-xs text-slate-500 mb-6">教育主管部门（章）</div>
              <div
                className={cn(
                  "absolute right-8 -top-4 w-28 h-28 rounded-full border-4 flex items-center justify-center text-center opacity-80 rotate-[-12deg]",
                  receipt.result === "passed"
                    ? "border-success-600 text-success-700"
                    : receipt.result === "conditional_passed"
                    ? "border-warning-600 text-warning-700"
                    : receipt.result === "need_rectify"
                    ? "border-primary-600 text-primary-700"
                    : "border-danger-600 text-danger-700"
                )}
                style={{ fontFamily: "STKaiti, KaiTi, serif" }}
              >
                <div className="text-sm font-black leading-tight">
                  上海市浦东新区
                  <br />
                  教育局
                  <br />
                  <span className="text-xs">民办教育处</span>
                </div>
              </div>
              <div className="h-0.5 bg-slate-300 mt-14" />
              <div className="text-xs text-slate-500 mt-2">
                审查人：{receipt.reviewer.split(" ")[0]}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                日期：{formatDate(receipt.reviewDate)}
              </div>
            </div>
          </div>

          <div className="mt-14 relative hidden lg:block no-print">
            <div className="flex items-end justify-end gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">审查人</div>
                <div className="font-serif font-semibold text-slate-800">
                  {receipt.reviewer}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  日期：{formatDate(receipt.reviewDate)}
                </div>
              </div>
              <div
                className={cn(
                  "relative w-32 h-32 rounded-full border-4 flex items-center justify-center text-center opacity-90 rotate-[-10deg] shadow-paper",
                  receipt.result === "passed"
                    ? "border-success-600 text-success-700 bg-success-50/70"
                    : receipt.result === "conditional_passed"
                    ? "border-warning-600 text-warning-700 bg-warning-50/70"
                    : receipt.result === "need_rectify"
                    ? "border-primary-600 text-primary-700 bg-primary-50/70"
                    : "border-danger-600 text-danger-700 bg-danger-50/70"
                )}
                style={{ fontFamily: "STKaiti, KaiTi, serif" }}
              >
                <div className="font-black leading-tight text-sm">
                  上海市
                  <br />
                  浦东新区
                  <br />
                  教育局
                  <br />
                  <span className="text-[10px] font-normal">民办教育专用章</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-dashed border-slate-200 text-[11px] text-slate-400 leading-relaxed space-y-1">
            <div>
              1. 本回执一式三份，学校、教育主管部门、存档各一份，具有同等效力。
            </div>
            <div>
              2. 年检结论分为「年检通过」「有条件通过」「需整改后再审」「不予通过」四种。
            </div>
            <div>
              3. 如对本结论有异议，可于收到回执之日起 15 个工作日内向教育主管部门提出书面复核申请。
            </div>
            <div className="text-right font-mono">
              - 第 1 页 / 共 1 页 · 系统生成时间：
              {new Date().toLocaleString("zh-CN")} -
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden animate-fade-in-up stagger-1 no-print">
        <div className="card-header !pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-card">
              <Camera className="w-4.5 h-4.5" strokeWidth={2} />
            </div>
            <div className="text-left">
              <div className="font-serif font-semibold text-slate-800">
                申报提交快照
              </div>
              <div className="text-xs text-slate-500">
                {submissionSnapshot
                  ? `快照时间：${submissionSnapshot.snapshotTime}`
                  : "尚未提交申报，暂无快照数据"}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          {!submissionSnapshot ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-slate-400" strokeWidth={1.8} />
              </div>
              <div className="text-slate-500 font-medium">尚未提交申报，暂无快照数据</div>
              <div className="text-xs text-slate-400 mt-1">完成申报提交后将自动生成快照</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-primary-50/30 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-card">
                    <ClipboardList className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-slate-800">基础信息摘要</div>
                    <div className="text-xs text-slate-500">申报时提交的基础信息</div>
                  </div>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">学校名称</span>
                    <span className="text-slate-800 font-medium text-right">{submissionSnapshot.schoolInfo.schoolName}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">办学学段</span>
                    <span className="text-slate-800 font-medium">{SCHOOL_STAGE_OPTIONS.find((s) => s.value === submissionSnapshot.schoolInfo.schoolStage)?.label || "-"}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">许可证号</span>
                    <span className="text-slate-800 font-mono text-xs text-right">{submissionSnapshot.schoolInfo.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">法人代表</span>
                    <span className="text-slate-800 font-medium">{submissionSnapshot.schoolInfo.legalPerson}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">校舍面积</span>
                    <span className="text-slate-800 font-medium">{submissionSnapshot.schoolInfo.buildingArea} ㎡</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">收费项目</span>
                    <span className="text-slate-800 font-medium">{submissionSnapshot.schoolInfo.chargingItemCount} 项</span>
                  </div>
                  <div className="flex justify-between gap-3 pt-2 border-t border-dashed border-slate-200">
                    <span className="text-slate-500 shrink-0">一致性校验</span>
                    {submissionSnapshot.schoolInfo.consistencyPassed ? (
                      <span className="inline-flex items-center gap-1 text-success-700 font-medium">
                        <CheckCircle2 className="w-4 h-4" strokeWidth={2.2} />
                        通过
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-danger-700 font-medium">
                        <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
                        有差异（{submissionSnapshot.schoolInfo.consistencyIssues}项）
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-warning-50/30 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning-500 to-warning-600 text-white flex items-center justify-center shadow-card">
                    <BarChart3 className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-slate-800">指标完成情况</div>
                    <div className="text-xs text-slate-500">年检指标填报统计</div>
                  </div>
                </div>
                <div className="flex items-end gap-4 mb-4">
                  <div>
                    <div className="font-serif font-black text-5xl tracking-tight text-warning-600">
                      {submissionSnapshot.indicators.completionRate}
                      <span className="text-2xl ml-0.5">%</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">整体完成率</div>
                  </div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-warning-400 to-warning-500 rounded-full transition-all duration-500"
                      style={{ width: `${submissionSnapshot.indicators.completionRate}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-dashed border-slate-200">
                  <div className="text-center">
                    <div className="font-serif font-bold text-xl text-slate-800">{submissionSnapshot.indicators.totalFields}</div>
                    <div className="text-xs text-slate-500 mt-0.5">总字段数</div>
                  </div>
                  <div className="text-center">
                    <div className="font-serif font-bold text-xl text-success-600">{submissionSnapshot.indicators.filledFields}</div>
                    <div className="text-xs text-slate-500 mt-0.5">已填写</div>
                  </div>
                  <div className="text-center">
                    <div className="font-serif font-bold text-xl text-danger-600">{submissionSnapshot.indicators.errorFields}</div>
                    <div className="text-xs text-slate-500 mt-0.5">必填缺失</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-success-50/30 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-500 to-success-600 text-white flex items-center justify-center shadow-card">
                    <FolderCheck className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-slate-800">材料清单概览</div>
                    <div className="text-xs text-slate-500">佐证材料上传情况</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-white/60 border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">总分类数</div>
                    <div className="font-serif font-bold text-lg text-slate-800 mt-0.5">{submissionSnapshot.materials.totalCategories}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">必传分类</div>
                    <div className="font-serif font-bold text-lg text-slate-800 mt-0.5">{submissionSnapshot.materials.requiredCategories}</div>
                  </div>
                  <div className="rounded-lg bg-white/60 border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">已上传 / 必传</div>
                    <div className="font-serif font-bold text-lg mt-0.5">
                      <span className="text-success-600">{submissionSnapshot.materials.totalUploaded}</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-slate-800">{submissionSnapshot.materials.totalRequired}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/60 border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">缺项数量</div>
                    <div className={`font-serif font-bold text-lg mt-0.5 ${submissionSnapshot.materials.missingCount > 0 ? "text-danger-600" : "text-success-600"}`}>
                      {submissionSnapshot.materials.missingCount}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-dashed border-slate-200">
                  {submissionSnapshot.materials.categoryList.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-600 truncate">{cat.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.required > 0 && cat.uploaded >= cat.required ? "bg-success-500" : cat.uploaded > 0 ? "bg-warning-500" : "bg-slate-300"}`}
                            style={{ width: `${cat.required > 0 ? Math.min(100, Math.round((cat.uploaded / cat.required) * 100)) : cat.uploaded > 0 ? 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-600 w-14 text-right">
                          {cat.uploaded}/{cat.required || "-"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl border p-5 ${
                submissionSnapshot.preAudit.overallPassed
                  ? "border-success-200 bg-gradient-to-br from-white to-success-50/40"
                  : "border-danger-200 bg-gradient-to-br from-white to-danger-50/40"
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-card ${
                    submissionSnapshot.preAudit.overallPassed
                      ? "bg-gradient-to-br from-success-500 to-success-600"
                      : "bg-gradient-to-br from-danger-500 to-danger-600"
                  }`}>
                    {submissionSnapshot.preAudit.overallPassed ? (
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <AlertTriangle className="w-5 h-5" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-slate-800">预审结论</div>
                    <div className="text-xs text-slate-500">提交前自动预审结果</div>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-4 border ${
                  submissionSnapshot.preAudit.overallPassed
                    ? "bg-success-100 text-success-700 border-success-200"
                    : "bg-danger-100 text-danger-700 border-danger-200"
                }`}>
                  {submissionSnapshot.preAudit.overallPassed ? (
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2.4} />
                  ) : (
                    <AlertTriangle className="w-4 h-4" strokeWidth={2.4} />
                  )}
                  {submissionSnapshot.preAudit.overallPassed ? "预审通过" : "预审不通过"}
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center rounded-lg bg-white/60 border border-slate-200 p-2.5">
                    <div className="font-serif font-bold text-lg text-success-600">{submissionSnapshot.preAudit.passedCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">通过</div>
                  </div>
                  <div className="text-center rounded-lg bg-white/60 border border-slate-200 p-2.5">
                    <div className="font-serif font-bold text-lg text-warning-600">{submissionSnapshot.preAudit.warningCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">提醒</div>
                  </div>
                  <div className="text-center rounded-lg bg-white/60 border border-slate-200 p-2.5">
                    <div className="font-serif font-bold text-lg text-danger-600">{submissionSnapshot.preAudit.failedCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">不通过</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-dashed border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">结论说明</div>
                  <div className="text-sm text-slate-700 leading-relaxed">{submissionSnapshot.preAudit.conclusion}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-hidden animate-fade-in-up stagger-2 no-print">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="w-full card-header !hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-success-500 text-white flex items-center justify-center shadow-card">
              <FileText className="w-4.5 h-4.5" strokeWidth={2} />
            </div>
            <div className="text-left">
              <div className="font-serif font-semibold text-slate-800">
                历年年检记录
              </div>
              <div className="text-xs text-slate-500">
                共 {receipt.historyRecords.length} 条历史记录，点击展开查看
              </div>
            </div>
          </div>
          <ChevronRight
            className={cn(
              "w-5 h-5 text-slate-400 transition-transform duration-300",
              showHistory && "rotate-90"
            )}
            strokeWidth={1.8}
          />
        </button>
        {showHistory && (
          <div className="card-body space-y-3 animate-fade-in">
            {receipt.historyRecords.map((r, i) => (
              <HistoryCard key={r.year} record={r} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pb-6 no-print">
        <button onClick={handlePrint} className="btn-primary px-6 py-2.5">
          <Printer className="w-4 h-4" strokeWidth={1.8} />
          打印本页回执
        </button>
      </div>
    </div>
  );
}
