
import { useState } from "react";
import {
  LayoutDashboard,
  History,
  Building2,
  Save,
  CheckCircle2,
  ShieldCheck,
  FileText,
  MapPin,
  Trash2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader, FormField, Input, Select, TagListInput } from "@/components/FormFields";
import {
  SCHOOL_STAGE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  ChargingItem,
  formatDate,
} from "@/types";
import { cn } from "@/components/Layout";

export default function BasicInfoPage() {
  const { schoolInfo, updateSchoolInfo, applyLastYearData, setCurrentStage } =
    useAppStore();
  const consistencyCheck = schoolInfo.consistencyCheck;
  const [showApplyModal, setShowApplyModal] = useState(false);
  const chargingItems = schoolInfo.chargingItems;

  const getFieldIssue = (field: string) =>
    consistencyCheck.issues.find((i) => i.field === field);

  const handleChange = (field: keyof typeof schoolInfo, value: any) => {
    updateSchoolInfo({ [field]: value } as Partial<typeof schoolInfo>);
  };

  const handleStageChange = (value: string) => {
    setCurrentStage(value as any);
  };

  const addChargingItem = () => {
    const newItem: ChargingItem = {
      id: `ci-new-${Date.now()}`,
      name: "",
      standard: "",
      unit: "",
      approvalNumber: "",
    };
    updateSchoolInfo({ chargingItems: [...chargingItems, newItem] });
  };

  const removeChargingItem = (id: string) => {
    if (chargingItems.length <= 1) return;
    updateSchoolInfo({
      chargingItems: chargingItems.filter((c) => c.id !== id),
    });
  };

  const updateChargingItem = (
    id: string,
    field: keyof ChargingItem,
    value: string
  ) => {
    updateSchoolInfo({
      chargingItems: chargingItems.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    ),
    });
  };

  const handleSave = () => {
    alert("基础信息已保存！");
  };

  const chargeIssue = getFieldIssue("chargingItems");
  const licenseIssue = getFieldIssue("licenseNumber");
  const legalIssue = getFieldIssue("legalPerson");
  const legalIdIssue = getFieldIssue("legalPersonIdCard");
  const areaIssue = getFieldIssue("buildingArea");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<LayoutDashboard className="w-6 h-6" strokeWidth={2} />}
        title="基础信息填报"
        subtitle="请核对学校基本信息、办学许可证、法人与校舍等信息。标红字段为必填，系统会自动与办学许可证原件数据进行一致性校验。"
        extra={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn-secondary"
            >
              <History className="w-4 h-4" strokeWidth={2} />
              沿用上年度
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4" strokeWidth={2} />
              保存信息
            </button>
          </div>
        }
        steps={[
          { label: "基础信息", status: "current" },
          { label: "指标填报", status: "pending" },
          { label: "材料上传", status: "pending" },
          { label: "校内审核", status: "pending" },
          { label: "教育局审查", status: "pending" },
          { label: "年检完成", status: "pending" },
        ]}
      />

      {!consistencyCheck.passed &&
        schoolInfo.consistencyCheck.issues.length > 0 && (
          <div className="card border-warning-300 bg-warning-50/40 p-5 animate-fade-in-up stagger-1">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center text-warning-600 shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="font-serif font-semibold text-warning-800">
                  一致性校验提示（
                  {schoolInfo.consistencyCheck.issues.length} 项待确认）
                </div>
                <div className="mt-3 space-y-2">
                  {schoolInfo.consistencyCheck.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "text-sm bg-white/70 rounded-lg px-3 py-2.5 border",
                        issue.severity === "error"
                          ? "border-danger-200"
                          : "border-warning-200"
                      )}
                    >
                      <span className="font-medium text-slate-800">
                        【{issue.fieldLabel}】
                      </span>
                      <span className="text-slate-500 mx-1">当前值</span>
                      <span className="font-mono text-danger-600 line-through mx-1">
                        {issue.currentValue}
                      </span>
                      <span className="text-slate-500 mx-1">备案值</span>
                      <span className="font-mono text-success-700 mx-1">
                        {issue.expectedValue}
                      </span>
                      <p
                        className={cn(
                          "mt-1 text-xs leading-relaxed",
                          issue.severity === "error"
                            ? "text-danger-600"
                            : "text-warning-700"
                        )}
                      >
                        {issue.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-warning-600">
                  <CheckCircle2 className="w-4 h-4" />
                  如信息确有变更，请上传相关备案文件至「佐证材料—证照类」栏目后再行提交。
                </div>
              </div>
            </div>
          </div>
        )}

      <section className="card animate-fade-in-up stagger-1">
        <div className="card-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-semibold text-slate-800">
                学校基本信息
              </div>
              <div className="text-xs text-slate-500">
                School Basic Information
              </div>
            </div>
          </div>
          <span className="badge bg-primary-50 text-primary-700 border border-primary-200">
            Section 01
          </span>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormField label="学校名称" required>
            <Input
              value={schoolInfo.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
            />
          </FormField>

          <FormField label="办学学段" required>
            <Select
              value={schoolInfo.schoolStage}
              onChange={(e) => handleStageChange(e.target.value)}
            >
              {SCHOOL_STAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="统一社会信用代码" required>
            <Input
              className="font-mono tracking-wide"
              value={schoolInfo.unifiedCreditCode}
              onChange={(e) => handleChange("unifiedCreditCode", e.target.value)}
            />
          </FormField>

          <FormField
            label="办学许可证号"
            required
            error={licenseIssue?.message}
          >
            <Input
              className={cn(
                "font-mono tracking-wide",
                licenseIssue && "input-error"
              )}
              value={schoolInfo.licenseNumber}
              onChange={(e) => handleChange("licenseNumber", e.target.value)}
            />
          </FormField>

          <FormField label="举办者（出资方）" required>
            <Input
              value={schoolInfo.organizer}
              onChange={(e) => handleChange("organizer", e.target.value)}
            />
          </FormField>

          <FormField label="校长" required>
            <Input
              value={schoolInfo.principal}
              onChange={(e) => handleChange("principal", e.target.value)}
            />
          </FormField>

          <FormField
            label="学校地址"
            required
            className="md:col-span-2"
            labelExtra={
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
            }
          >
            <Input
              value={schoolInfo.schoolAddress}
              onChange={(e) => handleChange("schoolAddress", e.target.value)}
            />
          </FormField>

          <FormField label="办学范围" required>
            <TagListInput
              values={schoolInfo.businessScope}
              onChange={(v) => handleChange("businessScope", v)}
              placeholder="输入办学范围后回车添加"
            />
          </FormField>
        </div>
      </section>

      <section className="card animate-fade-in-up stagger-2">
        <div className="card-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-success-100 text-success-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-semibold text-slate-800">
                办学许可证与法人信息
              </div>
              <div className="text-xs text-slate-500">
                School License & Legal Person
              </div>
            </div>
          </div>
          <span className="badge bg-success-50 text-success-700 border border-success-200">
            Section 02
          </span>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FormField
            label="法人代表姓名"
            required
            warning={legalIssue?.message}
          >
            <Input
              className={cn(legalIssue && "input-error")}
              value={schoolInfo.legalPerson}
              onChange={(e) => handleChange("legalPerson", e.target.value)}
            />
          </FormField>

          <FormField
            label="法人代表身份证号"
            required
            error={legalIdIssue?.message}
          >
            <Input
              className={cn("font-mono", legalIdIssue && "input-error")}
              value={schoolInfo.legalPersonIdCard}
              onChange={(e) =>
                handleChange("legalPersonIdCard", e.target.value)
              }
            />
          </FormField>

          <FormField label="许可证有效期起" required>
            <Input
              type="date"
              value={schoolInfo.licenseValidFrom}
              onChange={(e) => handleChange("licenseValidFrom", e.target.value)}
            />
          </FormField>

          <FormField label="许可证有效期止" required>
            <Input
              type="date"
              value={schoolInfo.licenseValidTo}
              onChange={(e) => handleChange("licenseValidTo", e.target.value)}
            />
          </FormField>

          <div className="md:col-span-2 flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
            <FileText className="w-3.5 h-3.5 text-primary-500" />
            许可证有效期限：
            {formatDate(schoolInfo.licenseValidFrom)} 至{" "}
            {formatDate(schoolInfo.licenseValidTo)}，剩余{" "}
            {
              Math.ceil(
                (new Date(schoolInfo.licenseValidTo).getTime() -
                  Date.now()
                ) /
                  (1000 * 60 * 60 * 24 * 365)
              )
            }{" "}
            年。
          </div>
        </div>
      </section>

      <section className="card animate-fade-in-up stagger-3">
        <div className="card-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-warning-100 text-warning-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-serif font-semibold text-slate-800">
                校舍与收费备案
              </div>
              <div className="text-xs text-slate-500">
                Campus Property & Charges
              </div>
            </div>
          </div>
          <span className="badge bg-warning-50 text-warning-700 border border-warning-200">
            Section 03
          </span>
        </div>
        <div className="card-body space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <FormField
              label="校舍建筑面积"
              required
              error={areaIssue?.message}
            >
              <Input
                type="number"
                unit="㎡"
                className={cn("font-mono", areaIssue && "input-error")}
                value={schoolInfo.buildingArea}
                onChange={(e) =>
                  handleChange(
                    "buildingArea",
                    Number(e.target.value) || 0
                  )
                }
              />
            </FormField>

            <FormField label="校舍产权性质" required>
              <Select
                value={schoolInfo.propertyType}
                onChange={(e) =>
                  handleChange("propertyType", e.target.value)
                }
              >
                {PROPERTY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="label-base label-required mb-0">
                  收费项目备案
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  请填写所有向学生收取的费用项目，须与发改委备案文件保持一致。
                </div>
              </div>
              <button onClick={addChargingItem} className="btn-secondary text-xs">
                <Plus className="w-3.5 h-3.5" />
                新增收费项
              </button>
            </div>
            {chargeIssue && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-warning-50 border border-warning-200 text-xs text-warning-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{chargeIssue.message}</span>
            </div>
            )}
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs text-slate-500">
                    <th className="px-4 py-2.5 text-left font-medium w-1/4">
                      收费项目名称
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium w-1/5">
                      收费标准
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium w-1/6">
                      计费单位
                    </th>
                    <th className="px-4 py-2.5 text-left font-medium w-1/4">
                      备案/批准文号
                    </th>
                    <th className="px-4 py-2.5 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {chargingItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-3 py-2">
                        <input
                          value={item.name}
                          onChange={(e) =>
                            updateChargingItem(item.id, "name", e.target.value)
                          }
                          placeholder="例如：学杂费"
                          className="w-full input-base !py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={item.standard}
                          onChange={(e) =>
                            updateChargingItem(
                              item.id,
                              "standard",
                              e.target.value
                            )
                          }
                          placeholder="18000"
                          className="w-full input-base !py-1.5 text-sm font-mono"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={item.unit}
                          onChange={(e) =>
                            updateChargingItem(item.id, "unit", e.target.value)
                          }
                          placeholder="元/学期"
                          className="w-full input-base !py-1.5 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={item.approvalNumber}
                          onChange={(e) =>
                            updateChargingItem(
                              item.id,
                              "approvalNumber",
                              e.target.value
                            )
                          }
                          placeholder="浦发改价[2023]89号"
                          className="w-full input-base !py-1.5 text-sm font-mono"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => removeChargingItem(item.id)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            chargingItems.length > 1
                              ? "text-danger-500 hover:bg-danger-50"
                              : "text-slate-300 cursor-not-allowed"
                          )}
                          disabled={chargingItems.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 pb-4 no-print">
        <button className="btn-secondary">取消</button>
        <button onClick={handleSave} className="btn-primary px-6 py-2.5">
          <Save className="w-4 h-4" strokeWidth={2} />
          保存并进入下一步
        </button>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg shadow-paper animate-fade-in-up">
            <div className="card-header">
              <div className="font-serif font-semibold text-slate-800">
                沿用上年度备案数据
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            </div>
            <div className="card-body space-y-4">
              <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 text-sm text-primary-800">
                <div className="font-medium mb-1">请确认以下操作</div>
                <p className="text-primary-700 leading-relaxed">
                  系统将把 2024 年度已通过备案的学校基础信息自动填充至本年度表单中。
                  <strong>
                    关键字段（学校名称、信用代码、许可证号等）如需变更，需要同步上传相关证明文件。
                  </strong>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">学校名称</div>
                  <div className="font-medium text-slate-800">启明外国语实验学校</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">许可证号</div>
                  <div className="font-mono text-sm text-slate-800">
                    教民131011540001234号
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">校长</div>
                  <div className="font-medium text-slate-800">王建国</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">上年度年检结论</div>
                  <div className="text-success-700 font-medium">年检通过 ✓</div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 rounded-b-xl">
              <button
                onClick={() => setShowApplyModal(false)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => {
                  applyLastYearData();
                  setShowApplyModal(false);
                }}
                className="btn-primary"
              >
                <History className="w-4 h-4" />
                确认沿用上年度
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
