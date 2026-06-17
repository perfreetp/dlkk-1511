
import { create } from "zustand";
import {
  SchoolBasicInfo,
  IndicatorCategory,
  IndicatorField,
  MaterialCategory,
  RectificationItem,
  ProgressOverview,
  NotificationItem,
  ChecklistItem,
  TimelineItem,
  InspectionReceipt,
  SchoolStage,
  ConsistencyIssue,
  ChargingItem,
} from "@/types";

// ==================== 备案基准数据（用于一致性校验） ====================
const licensedBaseline = {
  schoolName: "启明外国语实验学校",
  licenseNumber: "教民131011540001234号",
  legalPerson: "张明德",
  legalPersonIdCard: "310101197001011234",
  buildingArea: 20000,
  chargingItems: [
    { name: "学杂费", standard: "18000", approvalNumber: "浦发改价[2023]89号" },
    { name: "住宿费", standard: "4200", approvalNumber: "浦发改价[2023]90号" },
  ],
};

// ==================== 动态一致性校验 ====================
function runConsistencyCheck(info: SchoolBasicInfo): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  // 办学许可证号
  if (info.licenseNumber !== licensedBaseline.licenseNumber) {
    issues.push({
      field: "licenseNumber",
      fieldLabel: "办学许可证号",
      currentValue: info.licenseNumber || "(空)",
      expectedValue: licensedBaseline.licenseNumber,
      severity: "error",
      message: "办学许可证号与备案登记不一致，请确认是否办理了变更手续。",
    });
  }

  // 法人姓名
  if (info.legalPerson !== licensedBaseline.legalPerson) {
    issues.push({
      field: "legalPerson",
      fieldLabel: "法人代表姓名",
      currentValue: info.legalPerson || "(空)",
      expectedValue: licensedBaseline.legalPerson,
      severity: "warning",
      message: "法人代表姓名与备案登记不一致，如已变更请上传法人变更批复文件。",
    });
  }

  // 法人身份证号
  if (info.legalPersonIdCard !== licensedBaseline.legalPersonIdCard) {
    issues.push({
      field: "legalPersonIdCard",
      fieldLabel: "法人代表身份证号",
      currentValue: info.legalPersonIdCard || "(空)",
      expectedValue: licensedBaseline.legalPersonIdCard,
      severity: "error",
      message: "法人代表身份证号与备案登记不一致，请核对后重新填写。",
    });
  }

  // 校舍面积
  if (info.buildingArea !== licensedBaseline.buildingArea) {
    issues.push({
      field: "buildingArea",
      fieldLabel: "校舍建筑面积",
      currentValue: String(info.buildingArea),
      expectedValue: String(licensedBaseline.buildingArea),
      severity: "warning",
      message: `当前填报面积与办学许可证记载面积 ${licensedBaseline.buildingArea}㎡ 存在差异，请确认是否有改扩建备案。`,
    });
  }

  // 收费项目一致性
  const licensedNames = licensedBaseline.chargingItems.map((c) => c.name);
  const currentNames = info.chargingItems.map((c) => c.name);
  const missingCharges = licensedNames.filter((n) => !currentNames.includes(n));
  const extraCharges = currentNames.filter(
    (n) => !licensedNames.includes(n) && n.trim() !== ""
  );

  if (missingCharges.length > 0 || extraCharges.length > 0) {
    issues.push({
      field: "chargingItems",
      fieldLabel: "收费项目备案",
      currentValue: currentNames.filter((n) => n.trim()).join("、") || "(空)",
      expectedValue: licensedNames.join("、"),
      severity: "warning",
      message:
        (missingCharges.length > 0 ? `缺少备案收费项：${missingCharges.join("、")}；` : "") +
        (extraCharges.length > 0 ? `新增未备案收费项：${extraCharges.join("、")}；` : "") +
        "请确保收费项目与发改委备案文件一致。",
    });
  }

  return issues;
}

// ==================== 6 学段差异化指标字段 ====================
function makeIndicatorFields(stage: SchoolStage): IndicatorField[] {
  // 基础字段（所有学段共有）
  const baseC1 = [
    {
      id: "f1",
      categoryId: "c1",
      label: "校园占地面积",
      type: "number" as const,
      required: true,
      unit: "㎡",
      min: 3000,
      placeholder: "请输入占地面积",
      value: 28600,
    },
    {
      id: "f2",
      categoryId: "c1",
      label: "教学及辅助用房面积",
      type: "number" as const,
      required: true,
      unit: "㎡",
      placeholder: "请输入教学用房面积",
      value: 12800,
    },
    {
      id: "f3",
      categoryId: "c1",
      label: "普通教室数量",
      type: "number" as const,
      required: true,
      unit: "间",
      min: 6,
      value: 36,
    },
    {
      id: "f5",
      categoryId: "c1",
      label: "图书馆藏书量",
      type: "number" as const,
      required: true,
      unit: "册",
      min: 1000,
      value: 48500,
    },
    {
      id: "f6",
      categoryId: "c1",
      label: "体育运动场地面积",
      type: "number" as const,
      required: true,
      unit: "㎡",
      value: 6200,
    },
    {
      id: "f7",
      categoryId: "c1",
      label: "是否有标准环形跑道",
      type: "select" as const,
      required: true,
      options: [
        { value: "yes-200", label: "有，200米环形跑道" },
        { value: "yes-300", label: "有，300米环形跑道" },
        { value: "yes-400", label: "有，400米环形跑道" },
        { value: "no", label: "无" },
      ],
      value: "yes-300",
    },
    {
      id: "f8",
      categoryId: "c1",
      label: "教学仪器设备总值",
      type: "number" as const,
      required: true,
      unit: "万元",
      value: null,
      error: "请填写教学仪器设备总值",
    },
  ];

  const baseC2 = [
    {
      id: "f9",
      categoryId: "c2",
      label: "教职工总人数",
      type: "number" as const,
      required: true,
      unit: "人",
      value: 156,
    },
    {
      id: "f10",
      categoryId: "c2",
      label: "专任教师人数",
      type: "number" as const,
      required: true,
      unit: "人",
      value: 118,
    },
    {
      id: "f11",
      categoryId: "c2",
      label: "教师本科学历以上比例",
      type: "number" as const,
      required: true,
      unit: "%",
      min: 0,
      max: 100,
      value: 95.8,
    },
    {
      id: "f12",
      categoryId: "c2",
      label: "中高级以上职称教师比例",
      type: "number" as const,
      required: true,
      unit: "%",
      min: 0,
      max: 100,
      value: 52.5,
    },
    {
      id: "f13",
      categoryId: "c2",
      label: "师生比（1：X）",
      type: "number" as const,
      required: true,
      unit: "1:X",
      min: 3,
      max: 30,
      value: 12.6,
    },
    {
      id: "f15",
      categoryId: "c2",
      label: "本年度教师培训经费",
      type: "number" as const,
      required: true,
      unit: "万元",
      value: 32.5,
    },
    {
      id: "f16",
      categoryId: "c2",
      label: "教师参加继续教育完成率",
      type: "number" as const,
      required: true,
      unit: "%",
      value: 98,
    },
    {
      id: "f17",
      categoryId: "c2",
      label: "是否有师德师风专项制度",
      type: "boolean" as const,
      required: true,
      value: true,
    },
    {
      id: "f18",
      categoryId: "c2",
      label: "教师持证上岗率",
      type: "number" as const,
      required: true,
      unit: "%",
      value: 100,
    },
  ];

  const baseC3 = [
    {
      id: "f19",
      categoryId: "c3",
      label: "在校学生总数",
      type: "number" as const,
      required: true,
      unit: "人",
      value: 1488,
    },
    {
      id: "f20",
      categoryId: "c3",
      label: "班级数量",
      type: "number" as const,
      required: true,
      unit: "个",
      value: 36,
    },
    {
      id: "f21",
      categoryId: "c3",
      label: "平均班额",
      type: "number" as const,
      required: true,
      unit: "人",
      max: 55,
      value: 41.3,
    },
    {
      id: "f22",
      categoryId: "c3",
      label: "课程方案执行情况",
      type: "select" as const,
      required: true,
      options: [
        { value: "full", label: "严格执行国家课程方案，开齐开足全部课程" },
        { value: "partial", label: "基本执行，个别科目存在课时不足" },
        { value: "poor", label: "部分科目未按规定开设" },
      ],
      value: "full",
    },
    {
      id: "f23",
      categoryId: "c3",
      label: "学生体质健康达标率",
      type: "number" as const,
      required: true,
      unit: "%",
      value: 93.2,
    },
    {
      id: "f25",
      categoryId: "c3",
      label: "德育工作专项总结",
      type: "textarea" as const,
      required: true,
      placeholder: "请简要描述本年度德育工作开展情况...",
      value:
        "本年度学校坚持立德树人根本任务，建立以爱国主义、集体主义、社会主义教育为主线的德育体系，开展主题班会 48 次、校外实践活动 12 次、心理健康辅导 36 场。",
    },
  ];

  const baseC4 = [
    {
      id: "f26",
      categoryId: "c4",
      label: "学校总资产",
      type: "number" as const,
      required: true,
      unit: "万元",
      value: null,
      error: "请填写学校总资产",
    },
    {
      id: "f27",
      categoryId: "c4",
      label: "净资产",
      type: "number" as const,
      required: true,
      unit: "万元",
      value: null,
      error: "请填写净资产",
    },
    {
      id: "f28",
      categoryId: "c4",
      label: "本年度总收入",
      type: "number" as const,
      required: true,
      unit: "万元",
      value: 5280,
    },
    {
      id: "f29",
      categoryId: "c4",
      label: "本年度总支出",
      type: "number" as const,
      required: true,
      unit: "万元",
      value: 4920,
    },
    {
      id: "f30",
      categoryId: "c4",
      label: "是否经会计师事务所审计",
      type: "boolean" as const,
      required: true,
      value: true,
    },
    {
      id: "f31",
      categoryId: "c4",
      label: "审计意见",
      type: "select" as const,
      required: true,
      options: [
        { value: "standard", label: "标准无保留意见" },
        { value: "emphasis", label: "带强调事项段的无保留意见" },
        { value: "reserved", label: "保留意见" },
        { value: "adverse", label: "否定意见" },
        { value: "disclaimer", label: "无法表示意见" },
      ],
      value: "standard",
    },
  ];

  const baseC5 = [
    {
      id: "f32",
      categoryId: "c5",
      label: "安全管理机构是否健全",
      type: "boolean" as const,
      required: true,
      value: true,
    },
    {
      id: "f33",
      categoryId: "c5",
      label: "专职保安人员数量",
      type: "number" as const,
      required: true,
      unit: "人",
      min: 2,
      value: 14,
    },
    {
      id: "f34",
      categoryId: "c5",
      label: "一键式紧急报警装置",
      type: "boolean" as const,
      required: true,
      value: true,
    },
    {
      id: "f35",
      categoryId: "c5",
      label: "视频监控覆盖率",
      type: "number" as const,
      required: true,
      unit: "%",
      value: 100,
    },
    {
      id: "f36",
      categoryId: "c5",
      label: "消防设施是否年检合格",
      type: "boolean" as const,
      required: true,
      value: true,
    },
    {
      id: "f38",
      categoryId: "c5",
      label: "本年度安全演练次数",
      type: "number" as const,
      required: true,
      unit: "次",
      min: 2,
      value: 8,
    },
    {
      id: "f39",
      categoryId: "c5",
      label: "学生食品安全量化等级",
      type: "select" as const,
      required: true,
      options: [
        { value: "A", label: "A级（优秀）" },
        { value: "B", label: "B级（良好）" },
        { value: "C", label: "C级（一般）" },
      ],
      value: "A",
    },
    {
      id: "f40",
      categoryId: "c5",
      label: "本年度安全事故数量",
      type: "number" as const,
      required: true,
      unit: "起",
      value: 0,
    },
  ];

  // 学段差异化配置
  if (stage === "primary") {
    return [
      ...baseC1.map((f) =>
        f.id === "f5"
          ? { ...f, value: 32000, min: 10000 }
          : f.id === "f3"
          ? { ...f, value: 24, min: 12 }
          : f.id === "f8"
          ? { ...f, value: 280, required: false, error: undefined }
          : f
      ),
      {
        id: "f-c1-pri",
        categoryId: "c1",
        label: "少先队活动室",
        type: "boolean",
        required: true,
        value: true,
      },
      ...baseC2.map((f) =>
        f.id === "f12"
          ? { ...f, label: "小学高级教师比例", value: 45.2 }
          : f.id === "f13"
          ? { ...f, value: 19.5, max: 25, min: 10 }
          : f
      ),
      {
        id: "f-c2-pri",
        categoryId: "c2",
        label: "音体美专任教师数",
        type: "number",
        required: true,
        unit: "人",
        value: 12,
      },
      ...baseC3.map((f) =>
        f.id === "f21"
          ? { ...f, max: 45, value: 42.5 }
          : f.id === "f24"
          ? f
          : f
      ),
      {
        id: "f-c3-pri",
        categoryId: "c3",
        label: "小学学业水平合格率",
        type: "number",
        required: true,
        unit: "%",
        value: 97.5,
      },
      ...baseC4,
      ...baseC5.map((f) =>
        f.id === "f33" ? { ...f, min: 4, value: 8 } : f
      ),
      {
        id: "f-c5-pri",
        categoryId: "c5",
        label: "上下学护学岗制度",
        type: "boolean",
        required: true,
        value: true,
      },
    ] as IndicatorField[];
  }

  if (stage === "junior") {
    return [
      ...baseC1,
      {
        id: "f4",
        categoryId: "c1",
        label: "专用实验室数量",
        type: "number" as const,
        required: false,
        unit: "间" as const,
        value: 8,
      },
      {
        id: "f-c1-jun",
        categoryId: "c1",
        label: "微机教室数量",
        type: "number" as const,
        required: true,
        unit: "间" as const,
        value: 4,
      },
      ...baseC2,
      {
        id: "f14",
        categoryId: "c2",
        label: "双师型教师数量",
        type: "number" as const,
        required: false,
        unit: "人" as const,
        value: 0,
      },
      ...baseC3,
      {
        id: "f24",
        categoryId: "c3",
        label: "学业水平考试合格率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 96.8,
      },
      {
        id: "f-c3-jun",
        categoryId: "c3",
        label: "中考升学率",
        type: "number" as const,
        required: false,
        unit: "%" as const,
        value: 85.6,
      },
      ...baseC4,
      ...baseC5,
      {
        id: "f37",
        categoryId: "c5",
        label: "校车数量（如无填0）",
        type: "number" as const,
        required: true,
        unit: "辆" as const,
        value: 12,
      },
    ] as IndicatorField[];
  }

  if (stage === "senior") {
    return [
      ...baseC1.map((f) =>
        f.id === "f1"
          ? { ...f, value: 42000, min: 20000 }
          : f.id === "f3"
          ? { ...f, value: 48, min: 24 }
          : f
      ),
      {
        id: "f4",
        categoryId: "c1",
        label: "理化生实验室数量",
        type: "number" as const,
        required: true,
        unit: "间" as const,
        value: 12,
      },
      {
        id: "f-c1-sen",
        categoryId: "c1",
        label: "通用技术教室数量",
        type: "number" as const,
        required: true,
        unit: "间" as const,
        value: 4,
      },
      ...baseC2.map((f) =>
        f.id === "f13" ? { ...f, value: 10.8, max: 18, min: 6 } : f
      ),
      {
        id: "f-c2-sen",
        categoryId: "c2",
        label: "研究生学历教师比例",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 38.5,
      },
      ...baseC3,
      {
        id: "f24",
        categoryId: "c3",
        label: "学业水平合格性考试通过率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 98.5,
      },
      {
        id: "f-c3-sen",
        categoryId: "c3",
        label: "高考本科上线率",
        type: "number" as const,
        required: false,
        unit: "%" as const,
        value: 78.2,
      },
      ...baseC4,
      ...baseC5,
      {
        id: "f37",
        categoryId: "c5",
        label: "校车数量（如无填0）",
        type: "number" as const,
        required: false,
        unit: "辆" as const,
        value: 0,
      },
    ] as IndicatorField[];
  }

  if (stage === "vocational") {
    return [
      ...baseC1.map((f) =>
        f.id === "f3" ? { ...f, value: 32, min: 12 } : f
      ),
      {
        id: "f4",
        categoryId: "c1",
        label: "实训车间/基地数量",
        type: "number" as const,
        required: true,
        unit: "个" as const,
        value: 8,
      },
      {
        id: "f-c1-voc",
        categoryId: "c1",
        label: "实训设备总值",
        type: "number" as const,
        required: true,
        unit: "万元" as const,
        value: 2800,
      },
      ...baseC2,
      {
        id: "f14",
        categoryId: "c2",
        label: "双师型教师数量",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 46,
      },
      {
        id: "f-c2-voc",
        categoryId: "c2",
        label: "兼职教师占比",
        type: "number" as const,
        required: false,
        unit: "%" as const,
        value: 22.5,
      },
      ...baseC3.map((f) =>
        f.id === "f22"
          ? {
              ...f,
              label: "专业设置与产业匹配度",
              options: [
                { value: "high", label: "高度匹配，骨干专业对接主导产业" },
                { value: "medium", label: "基本匹配，部分专业需调整" },
                { value: "low", label: "匹配度较低，专业设置滞后" },
              ],
            }
          : f
      ),
      {
        id: "f-c3-voc",
        categoryId: "c3",
        label: "毕业生就业率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 96.5,
      },
      {
        id: "f-c3-voc2",
        categoryId: "c3",
        label: "专业对口就业率",
        type: "number" as const,
        required: false,
        unit: "%" as const,
        value: 78.3,
      },
      ...baseC4,
      ...baseC5,
      {
        id: "f37",
        categoryId: "c5",
        label: "校车数量（如无填0）",
        type: "number" as const,
        required: false,
        unit: "辆" as const,
        value: 4,
      },
      {
        id: "f-c5-voc",
        categoryId: "c5",
        label: "实训安全操作规程",
        type: "boolean" as const,
        required: true,
        value: true,
      },
    ] as IndicatorField[];
  }

  if (stage === "kindergarten") {
    return [
      {
        id: "f1",
        categoryId: "c1",
        label: "校园占地面积",
        type: "number" as const,
        required: true,
        unit: "㎡" as const,
        min: 1500,
        value: 6500,
      },
      {
        id: "f2",
        categoryId: "c1",
        label: "幼儿活动用房面积",
        type: "number" as const,
        required: true,
        unit: "㎡" as const,
        value: 3200,
      },
      {
        id: "f3",
        categoryId: "c1",
        label: "班级数量",
        type: "number" as const,
        required: true,
        unit: "个" as const,
        min: 3,
        value: 12,
      },
      {
        id: "f-c1-kinder",
        categoryId: "c1",
        label: "户外活动场地面积",
        type: "number" as const,
        required: true,
        unit: "㎡" as const,
        value: 2800,
      },
      {
        id: "f-c1-kinder2",
        categoryId: "c1",
        label: "玩教具配备达标",
        type: "boolean" as const,
        required: true,
        value: true,
      },
      {
        id: "f5",
        categoryId: "c1",
        label: "幼儿图书数量",
        type: "number" as const,
        required: true,
        unit: "册" as const,
        min: 500,
        value: 6800,
      },
      {
        id: "f8",
        categoryId: "c1",
        label: "教学仪器设备总值",
        type: "number" as const,
        required: false,
        unit: "万元" as const,
        value: 180,
      },
      // 师资
      {
        id: "f9",
        categoryId: "c2",
        label: "教职工总人数",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 68,
      },
      {
        id: "f10",
        categoryId: "c2",
        label: "专任教师人数",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 36,
      },
      {
        id: "f-c2-kinder",
        categoryId: "c2",
        label: "园长资格证持有率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 100,
      },
      {
        id: "f11",
        categoryId: "c2",
        label: "教师大专以上学历比例",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 92,
      },
      {
        id: "f-c2-kinder2",
        categoryId: "c2",
        label: "保健医生数量",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 2,
      },
      {
        id: "f17",
        categoryId: "c2",
        label: "是否有师德师风专项制度",
        type: "boolean" as const,
        required: true,
        value: true,
      },
      {
        id: "f16",
        categoryId: "c2",
        label: "教师继续教育完成率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 100,
      },
      // 教育教学
      {
        id: "f19",
        categoryId: "c3",
        label: "在园幼儿总数",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 360,
      },
      {
        id: "f21",
        categoryId: "c3",
        label: "平均班额",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        max: 35,
        value: 30,
      },
      {
        id: "f-c3-kinder",
        categoryId: "c3",
        label: "小学化倾向",
        type: "select" as const,
        required: true,
        options: [
          { value: "none", label: "无小学化倾向，以游戏为基本活动" },
          { value: "mild", label: "轻度小学化，需加强游戏化教学" },
          { value: "severe", label: "严重小学化，须立即整改" },
        ],
        value: "none",
      },
      {
        id: "f23",
        categoryId: "c3",
        label: "幼儿体质健康达标率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 95.8,
      },
      {
        id: "f25",
        categoryId: "c3",
        label: "保教工作年度总结",
        type: "textarea" as const,
        required: true,
        placeholder: "请简要描述本年度保教工作开展情况...",
        value:
          "本年度幼儿园坚持保教并重、游戏为主的办园理念，开设健康、语言、社会、科学、艺术五大领域课程，开展户外体育活动每天不少于2小时，无小学化教学倾向。",
      },
      // 财务
      ...baseC4,
      // 安全
      ...baseC5.map((f) =>
        f.id === "f33" ? { ...f, min: 2, value: 6 } : f
      ),
      {
        id: "f-c5-kinder",
        categoryId: "c5",
        label: "晨检制度落实",
        type: "boolean" as const,
        required: true,
        value: true,
      },
      {
        id: "f-c5-kinder2",
        categoryId: "c5",
        label: "食品安全等级",
        type: "select" as const,
        required: true,
        options: [
          { value: "A", label: "A级（优秀）" },
          { value: "B", label: "B级（良好）" },
          { value: "C", label: "C级（一般）" },
        ],
        value: "A",
      },
    ] as IndicatorField[];
  }

  if (stage === "training") {
    return [
      {
        id: "f1",
        categoryId: "c1",
        label: "教学场所总面积",
        type: "number" as const,
        required: true,
        unit: "㎡" as const,
        min: 200,
        value: 2600,
      },
      {
        id: "f2",
        categoryId: "c1",
        label: "教室数量",
        type: "number" as const,
        required: true,
        unit: "间" as const,
        min: 2,
        value: 18,
      },
      {
        id: "f-c1-train",
        categoryId: "c1",
        label: "培训类别",
        type: "select" as const,
        required: true,
        options: [
          { value: "academic", label: "学科类培训" },
          { value: "art", label: "艺术类培训" },
          { value: "sports", label: "体育类培训" },
          { value: "tech", label: "科技类培训" },
          { value: "vocational", label: "职业技能培训" },
          { value: "mixed", label: "综合类培训" },
        ],
        value: "mixed",
      },
      {
        id: "f5",
        categoryId: "c1",
        label: "教学仪器设备总值",
        type: "number" as const,
        required: false,
        unit: "万元" as const,
        value: 320,
      },
      {
        id: "f-c1-train2",
        categoryId: "c1",
        label: "收费公示制度",
        type: "boolean" as const,
        required: true,
        value: true,
      },
      // 师资
      {
        id: "f9",
        categoryId: "c2",
        label: "教职工总人数",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 42,
      },
      {
        id: "f10",
        categoryId: "c2",
        label: "专任教职人员数",
        type: "number" as const,
        required: true,
        unit: "人" as const,
        value: 28,
      },
      {
        id: "f-c2-train",
        categoryId: "c2",
        label: "教师资格证持有率",
        type: "number" as const,
        required: true,
        unit: "%" as const,
        value: 100,
      },
      {
        id: "f15",
        categoryId: "c2",
        label: "本年度教师培训经费",
        type: "number" as const,
        required: false,
        unit: "万元" as const,
        value: 12.5,
      },
      {
        id: "f17",
        categoryId: "c2",
        label: "是否有师德师风专项制度",
        type: "boolean" as const,
        required: true,
        value: true,
      },
      {
        id: "f-c2-train2",
        categoryId: "c2",
        label: "外籍教师数量",
        type: "number" as const,
        required: false,
        unit: "人" as const,
        value: 0,
      },
      // 教育教学
      {
        id: "f19",
        categoryId: "c3",
        label: "本年度培训人次",
        type: "number" as const,
        required: true,
        unit: "人次" as const,
        value: 1860,
      },
      {
        id: "f-c3-train",
        categoryId: "c3",
        label: "平均班级规模",
        type: "number" as const,
        required: true,
        unit: "人/班" as const,
        value: 24,
      },
      {
        id: "f22",
        categoryId: "c3",
        label: "培训质量满意度",
        type: "select" as const,
        required: false,
        options: [
          { value: "high", label: "90%以上（高）" },
          { value: "medium", label: "70%-90%（中）" },
          { value: "low", label: "70%以下（低）" },
        ],
        value: "high",
      },
      {
        id: "f25",
        categoryId: "c3",
        label: "年度培训工作总结",
        type: "textarea" as const,
        required: true,
        placeholder: "请简要描述本年度培训工作开展情况...",
        value:
          "本年度培训机构严格遵守双减政策，开设素质类培训课程24门，全年累计培训学员1860人次，家长满意度95%以上，无违规收费、超纲教学等行为。",
      },
      // 财务
      ...baseC4.map((f) =>
        f.id === "f26" || f.id === "f27" ? { ...f, required: false, error: undefined, value: 0 } : f
      ),
      {
        id: "f-c4-train",
        categoryId: "c4",
        label: "预收费监管账户",
        type: "boolean" as const,
        required: true,
        value: true,
      },
      // 安全
      ...baseC5.map((f) =>
        f.id === "f33" ? { ...f, min: 1, value: 3 } : f.id === "f38" ? { ...f, min: 1, value: 4 } : f
      ),
      {
        id: "f-c5-train",
        categoryId: "c5",
        label: "学员人身意外保险",
        type: "boolean" as const,
        required: true,
        value: true,
      },
    ] as IndicatorField[];
  }

  return [...baseC1, ...baseC2, ...baseC3, ...baseC4, ...baseC5] as IndicatorField[];
}

// ==================== 指标分类（所有学段通用） ====================
const mockIndicatorCategories: IndicatorCategory[] = [
  { id: "c1", name: "办学条件", icon: "Building2", totalItems: 0, completedItems: 0 },
  { id: "c2", name: "师资队伍", icon: "Users", totalItems: 0, completedItems: 0 },
  { id: "c3", name: "教育教学", icon: "GraduationCap", totalItems: 0, completedItems: 0 },
  { id: "c4", name: "财务管理", icon: "Wallet", totalItems: 0, completedItems: 0 },
  { id: "c5", name: "安全管理", icon: "ShieldCheck", totalItems: 0, completedItems: 0 },
];

// ==================== Mock 数据 ====================
const mockSchoolInfo: SchoolBasicInfo = {
  id: "SCH-2024-001",
  schoolName: "启明外国语实验学校",
  schoolStage: "junior",
  unifiedCreditCode: "91310115MA1K3XXXX",
  licenseNumber: "教民131011540001234号",
  organizer: "上海启明教育投资有限公司",
  principal: "王建国",
  legalPerson: "张明德",
  legalPersonIdCard: "310101197001011234",
  businessScope: ["初中阶段学历教育", "课外兴趣培训"],
  licenseValidFrom: "2022-03-15",
  licenseValidTo: "2027-03-14",
  schoolAddress: "上海市浦东新区张江高科技园区博云路 2 号",
  buildingArea: 18500,
  propertyType: "leased",
  chargingItems: [
    { id: "ci1", name: "学杂费", standard: "18000", unit: "元/学期", approvalNumber: "浦发改价[2023]89号" },
    { id: "ci2", name: "住宿费", standard: "4200", unit: "元/学期", approvalNumber: "浦发改价[2023]90号" },
    { id: "ci3", name: "伙食费", standard: "30", unit: "元/天", approvalNumber: "浦发改价[2023]91号" },
  ],
  consistencyCheck: { passed: false, issues: [] },
};

const mockMaterials: MaterialCategory[] = [
  {
    id: "m1",
    name: "证照类材料",
    icon: "Certificate",
    required: true,
    uploadedCount: 4,
    requiredCount: 5,
    description: "办学许可证、法人登记证、组织机构代码证、收费许可证、校长任职资格证等",
    files: [
      { id: "f-001", categoryId: "m1", name: "办学许可证（正本）.pdf", size: 2485760, type: "application/pdf", uploadTime: "2026-05-28 10:23", uploader: "李经办", status: "passed" },
      { id: "f-002", categoryId: "m1", name: "民办非企业单位登记证书.pdf", size: 1834496, type: "application/pdf", uploadTime: "2026-05-28 10:25", uploader: "李经办", status: "passed" },
      { id: "f-003", categoryId: "m1", name: "税务登记证.jpg", size: 983040, type: "image/jpeg", uploadTime: "2026-05-28 10:28", uploader: "李经办", status: "passed" },
      { id: "f-004", categoryId: "m1", name: "校长资格证.pdf", size: 1257472, type: "application/pdf", uploadTime: "2026-05-28 14:12", uploader: "李经办", status: "checking" },
    ],
  },
  {
    id: "m2",
    name: "财务类材料",
    icon: "Wallet",
    required: true,
    uploadedCount: 3,
    requiredCount: 4,
    description: "年度财务审计报告、资产负债表、收支明细表、收费备案表等",
    files: [
      { id: "f-101", categoryId: "m2", name: "2025年度审计报告.pdf", size: 5242880, type: "application/pdf", uploadTime: "2026-06-02 09:15", uploader: "李经办", status: "passed" },
      { id: "f-102", categoryId: "m2", name: "资产负债表.xlsx", size: 144384, type: "application/vnd.ms-excel", uploadTime: "2026-06-02 09:18", uploader: "李经办", status: "uploaded" },
      { id: "f-103", categoryId: "m2", name: "收费项目备案表.pdf", size: 1048576, type: "application/pdf", uploadTime: "2026-06-02 09:22", uploader: "李经办", status: "passed" },
    ],
  },
  {
    id: "m3",
    name: "师资类材料",
    icon: "Users",
    required: true,
    uploadedCount: 5,
    requiredCount: 5,
    description: "教师名册、教师资格证清单、教师学历证书、社保证明、培训记录等",
    files: [
      { id: "f-201", categoryId: "m3", name: "教职工花名册.xlsx", size: 209920, type: "application/vnd.ms-excel", uploadTime: "2026-06-05 15:40", uploader: "李经办", status: "passed" },
      { id: "f-202", categoryId: "m3", name: "教师资格证清单汇总.pdf", size: 8388608, type: "application/pdf", uploadTime: "2026-06-05 15:45", uploader: "李经办", status: "passed" },
      { id: "f-203", categoryId: "m3", name: "社保缴纳证明（全年）.pdf", size: 4194304, type: "application/pdf", uploadTime: "2026-06-05 16:00", uploader: "李经办", status: "passed" },
      { id: "f-204", categoryId: "m3", name: "教师继续教育学分证明.pdf", size: 3670016, type: "application/pdf", uploadTime: "2026-06-05 16:08", uploader: "李经办", status: "passed" },
      { id: "f-205", categoryId: "m3", name: "师德师风考核结果.pdf", size: 2097152, type: "application/pdf", uploadTime: "2026-06-05 16:15", uploader: "李经办", status: "checking" },
    ],
  },
  {
    id: "m4",
    name: "安保类材料",
    icon: "ShieldCheck",
    required: true,
    uploadedCount: 6,
    requiredCount: 6,
    description: "保安证、监控设备清单、消防验收报告、应急预案、演练记录、校车资质等",
    files: [
      { id: "f-301", categoryId: "m4", name: "消防设施年度检测报告.pdf", size: 3145728, type: "application/pdf", uploadTime: "2026-06-08 10:05", uploader: "李经办", status: "passed" },
      { id: "f-302", categoryId: "m4", name: "保安员资格证汇总.pdf", size: 4718592, type: "application/pdf", uploadTime: "2026-06-08 10:10", uploader: "李经办", status: "passed" },
      { id: "f-303", categoryId: "m4", name: "校园一键报警联网证明.pdf", size: 524288, type: "application/pdf", uploadTime: "2026-06-08 10:15", uploader: "李经办", status: "passed" },
      { id: "f-304", categoryId: "m4", name: "校车行驶证及保险单.pdf", size: 2621440, type: "application/pdf", uploadTime: "2026-06-08 10:20", uploader: "李经办", status: "passed" },
      { id: "f-305", categoryId: "m4", name: "安全应急预案汇编.pdf", size: 1572864, type: "application/pdf", uploadTime: "2026-06-08 10:25", uploader: "李经办", status: "passed" },
      { id: "f-306", categoryId: "m4", name: "本年度演练记录台账.pdf", size: 2097152, type: "application/pdf", uploadTime: "2026-06-08 10:30", uploader: "李经办", status: "passed" },
    ],
  },
  {
    id: "m5",
    name: "其他材料",
    icon: "FolderOpen",
    required: false,
    uploadedCount: 2,
    requiredCount: 0,
    description: "党建工作材料、德育特色材料、获奖证书及其他需要补充说明的材料",
    files: [
      { id: "f-401", categoryId: "m5", name: "党支部年度工作总结.pdf", size: 1048576, type: "application/pdf", uploadTime: "2026-06-10 14:00", uploader: "李经办", status: "uploaded" },
      { id: "f-402", categoryId: "m5", name: "本年度获奖情况汇总.pdf", size: 3670016, type: "application/pdf", uploadTime: "2026-06-10 14:10", uploader: "李经办", status: "uploaded" },
    ],
  },
];

const mockRectifications: RectificationItem[] = [
  {
    id: "r1",
    title: "校舍建筑面积与办学许可证记载不一致",
    description:
      "本次申报校舍建筑面积为 18500㎡，而办学许可证记载为 20000㎡，存在 1500㎡ 差异，需补充说明原因及变更备案材料。",
    suggestion:
      "请提供校舍改扩建工程的竣工验收备案表、规划许可证等文件，或在备注栏中说明差异原因并加盖公章确认。",
    deadline: "2026-06-25",
    status: "in_progress",
    responsible: "李经办",
    createdAt: "2026-06-15 09:30",
    updatedAt: "2026-06-17 15:12",
    diffData: [
      { field: "校舍建筑面积", oldValue: "20000 ㎡", newValue: "18500 ㎡", changed: true },
      { field: "产权性质", oldValue: "租赁", newValue: "租赁", changed: false },
    ],
    comments: [
      { id: "rc1", author: "赵审查", role: "教育局审查员", content: "根据办学许可证副本记载，校舍面积应为 20000㎡。请学校补充说明 2024 年 7 月东侧教学楼拆除后的权属变更情况，并附上改扩建备案文件。", createdAt: "2026-06-15 09:30" },
      { id: "rc2", author: "李经办", role: "学校经办人", content: "收到！2024 年 8 月学校因市政工程对东侧附楼进行了部分拆除（约 1500㎡），相关备案文件正在整理扫描，预计明日上传。", createdAt: "2026-06-16 11:08" },
    ],
  },
  {
    id: "r2",
    title: "教学仪器设备总值未填报",
    description: "办学条件指标中【教学仪器设备总值】字段为必填项，本次未填写。",
    suggestion: "请按学校期末财务账面上的教学仪器设备实际价值如实填写（单位：万元）。",
    deadline: "2026-06-22",
    status: "pending",
    responsible: "李经办",
    createdAt: "2026-06-15 09:32",
    updatedAt: "2026-06-15 09:32",
    comments: [{ id: "rc3", author: "赵审查", role: "教育局审查员", content: "必填项缺失，请尽快补充。", createdAt: "2026-06-15 09:32" }],
  },
  {
    id: "r3",
    title: "证照类缺少收费许可证件",
    description: "证照类材料必传 5 份，当前仅上传 4 份，缺少《收费许可证》或最新的收费备案文件。",
    suggestion: "请补充上传市场监管部门颁发的收费许可证或发改委备案的收费文件。",
    deadline: "2026-06-22",
    status: "passed",
    responsible: "李经办",
    createdAt: "2026-06-12 14:20",
    updatedAt: "2026-06-14 10:15",
    comments: [
      { id: "rc4", author: "钱审查", role: "教育局审查员", content: "缺少收费许可证，请补充。", createdAt: "2026-06-12 14:20" },
      { id: "rc5", author: "李经办", role: "学校经办人", content: "已上传浦发改价[2023]89-91号三份备案表，请查收。", createdAt: "2026-06-13 16:45" },
      { id: "rc6", author: "钱审查", role: "教育局审查员", content: "材料已审核通过。", createdAt: "2026-06-14 10:15" },
    ],
  },
];

const mockProgress: ProgressOverview = {
  currentStage: 4,
  totalStages: 6,
  stageNames: ["基础信息", "指标填报", "佐证材料", "校内审核", "教育局审查", "年检完成"],
  stageStatuses: ["completed", "completed", "completed", "current", "pending", "pending"],
  overallPercentage: 68,
  submissionDeadline: "2026-06-30",
};

const mockChecklist: ChecklistItem[] = [
  { id: "cl1", content: "学校基础信息已核对无误，办学许可证、法人信息一致。", checked: true, required: true },
  { id: "cl2", content: "年检指标填报数据已逐项复核，数字准确，逻辑合理。", checked: true, required: true },
  { id: "cl3", content: "所有必传佐证材料已上传，文件清晰完整。", checked: false, required: true, remark: "证照类尚缺 1 份、财务类尚缺 1 份，需补充。" },
  { id: "cl4", content: "财务数据经会计师事务所审计，审计意见为标准无保留。", checked: true, required: true },
  { id: "cl5", content: "学校本年度不存在重大安全事故、违规办学、群体性事件。", checked: true, required: true },
  { id: "cl6", content: "已阅读《民办学校年检办法》，对填报信息真实性负责。", checked: false, required: true },
];

const mockTimeline: TimelineItem[] = [
  { id: "t1", time: "2026-05-20 09:00", action: "年检任务启动", operator: "系统", detail: "2025 年度民办学校年检工作正式启动，平台已开放填报入口。", type: "info" },
  { id: "t2", time: "2026-05-28 10:15", action: "经办人登录", operator: "李经办", detail: "年检经办人登录平台，开始进行基础信息填报。", type: "info" },
  { id: "t3", time: "2026-06-08 16:30", action: "沿用上年度数据", operator: "李经办", detail: "基础信息 38 项字段中，32 项沿用了上年度备案数据。", type: "success" },
  { id: "t4", time: "2026-06-10 11:40", action: "材料上传完成", operator: "李经办", detail: "完成 5 大类共 20 份佐证材料上传。", type: "success" },
  { id: "t5", time: "2026-06-12 14:00", action: "提交初审", operator: "王校长", detail: "校长审核后提交至教育局进行初审。", type: "success" },
  { id: "t6", time: "2026-06-15 09:35", action: "退回补正", operator: "赵审查", detail: "教育局审查提出 3 条整改意见，请学校于 6 月 25 日前完成。", type: "warning" },
  { id: "t7", time: "2026-06-14 10:15", action: "整改事项通过", operator: "钱审查", detail: "证照类收费许可证缺失问题已补正，审核通过。", type: "success" },
];

const mockReceipt: InspectionReceipt = {
  id: "RCP-2026-001",
  receiptNumber: "沪浦教年验〔2026〕0128 号",
  schoolName: "启明外国语实验学校",
  schoolStage: "junior",
  submissionDate: "2026-06-12",
  inspectionYear: "2025",
  result: "need_rectify",
  resultDescription:
    "学校基本办学条件达标，师资队伍整体稳定，教育教学秩序良好。但在校舍产权一致性、财务数据完备性方面需补充相关材料。经研究决定：本次年检结论为『需整改后再审』，请于 2026 年 6 月 30 日前完成整改并重新提交。",
  reviewComments:
    "1. 请补充东侧附楼拆除后的改扩建备案文件及最新校舍测绘报告；\n2. 请补充教学仪器设备总值及年末总资产、净资产财务数据；\n3. 请确保所有整改事项于 6 月 30 日前完成，逾期将按『不予通过』处理。",
  reviewer: "赵振华  浦东新区教育局民办教育处",
  reviewDate: "2026-06-15",
  electronicSeal: "上海市浦东新区教育局",
  historyRecords: [
    { year: "2024", result: "passed", receiptNumber: "沪浦教年验〔2025〕0362 号", reviewDate: "2025-06-18" },
    { year: "2023", result: "passed", receiptNumber: "沪浦教年验〔2024〕0298 号", reviewDate: "2024-06-20" },
    { year: "2022", result: "conditional_passed", receiptNumber: "沪浦教年验〔2023〕0211 号", reviewDate: "2023-06-22" },
  ],
};

// ==================== localStorage 持久化 ====================
const STORAGE_KEY = "minjian-inspection-store-v1";

function loadFromStorage(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(state: AppState) {
  try {
    const {
      schoolInfo,
      indicatorFields,
      currentStage,
      materials,
      rectifications,
      checklist,
      timeline,
    } = state;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schoolInfo,
        indicatorFields,
        currentStage,
        materials,
        rectifications,
        checklist,
        timeline,
      })
    );
  } catch {
    // ignore
  }
}

// ==================== 动态计算通知 ====================
function computeNotifications(
  indicatorFields: IndicatorField[],
  materials: MaterialCategory[],
  consistencyIssues: ConsistencyIssue[],
  stage: SchoolStage
): NotificationItem[] {
  const items: NotificationItem[] = [];

  // 截止日期提醒（固定）
  items.push({
    id: "n-deadline",
    type: "deadline",
    title: "距年检申报截止还剩 12 天",
    message:
      "2025 年度民办学校年检申报将于 2026-06-30 截止，请在截止日前完成报送。",
    read: false,
    createdAt: "2026-06-18 08:00",
    deadline: "2026-06-30",
  });

  // 指标错项
  let errorCount = 0;
  const errorFields: string[] = [];
  for (const f of indicatorFields) {
    const isEmpty =
      f.value === undefined ||
      f.value === null ||
      f.value === "" ||
      (typeof f.value === "number" && isNaN(f.value));
    if (f.required && isEmpty) {
      errorCount++;
      if (errorFields.length < 3) errorFields.push(f.label);
    }
  }
  if (errorCount > 0) {
    items.push({
      id: "n-indicator-error",
      type: "error",
      title: `指标填报存在 ${errorCount} 项错项/空缺`,
      message: `【${errorFields.join("】【")}】等字段尚未填写，请尽快补充。`,
      read: false,
      createdAt: "2026-06-17 16:30",
    });
  }

  // 材料缺项
  let missingMaterialCount = 0;
  const missingMaterialNames: string[] = [];
  for (const m of materials) {
    if (m.required) {
      const diff = Math.max(0, m.requiredCount - m.uploadedCount);
      if (diff > 0) {
        missingMaterialCount += diff;
        missingMaterialNames.push(m.name);
      }
    }
  }
  if (missingMaterialCount > 0) {
    items.push({
      id: "n-material-missing",
      type: "missing",
      title: `材料存在 ${missingMaterialCount} 项缺项`,
      message: `${missingMaterialNames.join("、")} 缺少必传材料，请尽快补充上传。`,
      read: false,
      createdAt: "2026-06-17 15:10",
    });
  }

  // 一致性问题
  if (consistencyIssues.length > 0) {
    items.push({
      id: "n-consistency",
      type: "info",
      title: `一致性校验发现 ${consistencyIssues.length} 项差异`,
      message: "基础信息与办学许可证备案数据存在差异，请核对或上传变更证明文件。",
      read: false,
      createdAt: "2026-06-17 14:00",
    });
  }

  return items;
}

// ==================== 动态计算进度百分比 ====================
function computeOverallPercentage(
  indicatorFields: IndicatorField[],
  materials: MaterialCategory[],
  checklist: ChecklistItem[],
  consistencyPassed: boolean
): number {
  // 基础信息 (20%)
  const infoScore = consistencyPassed ? 100 : 60;
  // 指标填报 (30%)
  let filled = 0;
  for (const f of indicatorFields) {
    const isEmpty =
      f.value === undefined ||
      f.value === null ||
      f.value === "" ||
      (typeof f.value === "number" && isNaN(f.value));
    if (!isEmpty) filled++;
  }
  const indicatorScore = indicatorFields.length
    ? Math.round((filled / indicatorFields.length) * 100)
    : 0;
  // 材料上传 (30%)
  let required = 0;
  let uploaded = 0;
  for (const m of materials) {
    if (m.required) {
      required += m.requiredCount;
      uploaded += Math.min(m.uploadedCount, m.requiredCount);
    }
  }
  const materialScore = required ? Math.round((uploaded / required) * 100) : 100;
  // 校内审核 (20%)
  const totalRequired = checklist.filter((c) => c.required).length;
  const checkedRequired = checklist.filter((c) => c.required && c.checked).length;
  const checklistScore = totalRequired
    ? Math.round((checkedRequired / totalRequired) * 100)
    : 100;

  return Math.round(infoScore * 0.2 + indicatorScore * 0.3 + materialScore * 0.3 + checklistScore * 0.2);
}

// ==================== 动态计算审核清单备注 ====================
function computeChecklistRemark(materials: MaterialCategory[]): string {
  const missing: string[] = [];
  for (const m of materials) {
    if (m.required) {
      const diff = Math.max(0, m.requiredCount - m.uploadedCount);
      if (diff > 0) {
        missing.push(`${m.name.replace("类材料", "")}尚缺 ${diff} 份`);
      }
    }
  }
  if (missing.length === 0) return "";
  return missing.join("、") + "，需补充。";
}

// ==================== AppState 接口 ====================
interface AppState {
  schoolInfo: SchoolBasicInfo;
  indicatorCategories: IndicatorCategory[];
  indicatorFields: Record<SchoolStage, IndicatorField[]>;
  currentStage: SchoolStage;
  materials: MaterialCategory[];
  rectifications: RectificationItem[];
  progress: ProgressOverview;
  notifications: NotificationItem[];
  checklist: ChecklistItem[];
  timeline: TimelineItem[];
  receipt: InspectionReceipt;
  setCurrentStage: (stage: SchoolStage) => void;
  updateSchoolInfo: (patch: Partial<SchoolBasicInfo>) => void;
  updateIndicatorField: (fieldId: string, value: any) => void;
  addMaterialFile: (categoryId: string, file: File) => void;
  removeMaterialFile: (categoryId: string, fileId: string) => void;
  updateRectificationStatus: (id: string, status: RectificationItem["status"]) => void;
  addRectificationComment: (id: string, content: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleChecklistItem: (id: string) => void;
  applyLastYearData: () => void;
  submitInspection: () => void;
  refreshDerivedData: () => void;
}

// ==================== 初始化数据（支持 localStorage 恢复） ====================
function getInitialState() {
  const saved = loadFromStorage();

  // 每个学段的指标字段
  const allStageFields: Record<SchoolStage, IndicatorField[]> = {
    primary: saved?.indicatorFields?.primary || makeIndicatorFields("primary"),
    junior: saved?.indicatorFields?.junior || makeIndicatorFields("junior"),
    senior: saved?.indicatorFields?.senior || makeIndicatorFields("senior"),
    vocational: saved?.indicatorFields?.vocational || makeIndicatorFields("vocational"),
    kindergarten: saved?.indicatorFields?.kindergarten || makeIndicatorFields("kindergarten"),
    training: saved?.indicatorFields?.training || makeIndicatorFields("training"),
  };

  const schoolInfo: SchoolBasicInfo = saved?.schoolInfo || mockSchoolInfo;
  const currentStage: SchoolStage = (saved?.currentStage as SchoolStage) || mockSchoolInfo.schoolStage;
  const materials: MaterialCategory[] = saved?.materials || mockMaterials;
  const checklist: ChecklistItem[] = saved?.checklist || mockChecklist;
  const timeline: TimelineItem[] = saved?.timeline || mockTimeline;
  const rectifications: RectificationItem[] = saved?.rectifications || mockRectifications;

  // 初始一致性校验
  const issues = runConsistencyCheck(schoolInfo);
  schoolInfo.consistencyCheck = {
    passed: issues.length === 0,
    issues,
  };

  // 初始通知
  const notifications = computeNotifications(
    allStageFields[currentStage],
    materials,
    issues,
    currentStage
  );

  // 初始进度
  const overallPercentage = computeOverallPercentage(
    allStageFields[currentStage],
    materials,
    checklist,
    issues.length === 0
  );

  // 更新审核清单备注（材料项）
  const materialRemark = computeChecklistRemark(materials);
  if (materialRemark) {
    const cl3 = checklist.find((c) => c.id === "cl3");
    if (cl3) cl3.remark = materialRemark;
  }

  return {
    schoolInfo,
    indicatorCategories: mockIndicatorCategories,
    indicatorFields: allStageFields,
    currentStage,
    materials,
    rectifications,
    progress: {
      ...mockProgress,
      overallPercentage,
    },
    notifications,
    checklist,
    timeline,
    receipt: mockReceipt,
  };
}

// ==================== Store 定义 ====================
export const useAppStore = create<AppState>((set, get) => {
  const initial = getInitialState();

  return {
    ...initial,

    // 学段切换（同步基础信息和指标页）
    setCurrentStage: (stage) =>
      set((s) => {
        const newSchoolInfo = { ...s.schoolInfo, schoolStage: stage };
        const issues = runConsistencyCheck(newSchoolInfo);
        newSchoolInfo.consistencyCheck = {
          passed: issues.length === 0,
          issues,
        };

        const notifications = computeNotifications(
          s.indicatorFields[stage],
          s.materials,
          issues,
          stage
        );

        const overallPercentage = computeOverallPercentage(
          s.indicatorFields[stage],
          s.materials,
          s.checklist,
          issues.length === 0
        );

        const next = {
          currentStage: stage,
          schoolInfo: newSchoolInfo,
          notifications,
          progress: { ...s.progress, overallPercentage },
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    // 更新学校信息（触发实时一致性校验、通知更新、进度更新）
    updateSchoolInfo: (patch) =>
      set((s) => {
        const newInfo = { ...s.schoolInfo, ...patch };
        const issues = runConsistencyCheck(newInfo);
        newInfo.consistencyCheck = {
          passed: issues.length === 0,
          issues,
        };

        // 如果学段变了，同步 currentStage
        const stage = patch.schoolStage
          ? (patch.schoolStage as SchoolStage)
          : s.currentStage;

        const notifications = computeNotifications(
          s.indicatorFields[stage],
          s.materials,
          issues,
          stage
        );

        const overallPercentage = computeOverallPercentage(
          s.indicatorFields[stage],
          s.materials,
          s.checklist,
          issues.length === 0
        );

        const next = {
          schoolInfo: newInfo,
          currentStage: stage,
          notifications,
          progress: { ...s.progress, overallPercentage },
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    // 更新指标字段（触发通知更新、进度更新）
    updateIndicatorField: (fieldId, value) =>
      set((s) => {
        const stage = s.currentStage;
        const fields = s.indicatorFields[stage].map((f) =>
          f.id === fieldId ? { ...f, value, error: undefined } : f
        );
        const newIndicatorFields = {
          ...s.indicatorFields,
          [stage]: fields,
        };

        const notifications = computeNotifications(
          fields,
          s.materials,
          s.schoolInfo.consistencyCheck.issues,
          stage
        );

        const overallPercentage = computeOverallPercentage(
          fields,
          s.materials,
          s.checklist,
          s.schoolInfo.consistencyCheck.passed
        );

        const next = {
          indicatorFields: newIndicatorFields,
          notifications,
          progress: { ...s.progress, overallPercentage },
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    // 添加材料文件（触发通知、进度、审核清单备注更新）
    addMaterialFile: (categoryId, file) =>
      set((s) => {
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const newFile = {
          id: `f-new-${Date.now()}`,
          categoryId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadTime: timeStr,
          uploader: "李经办",
          status: "uploaded" as const,
        };

        const materials = s.materials.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                files: [...c.files, newFile],
                uploadedCount: c.uploadedCount + 1,
              }
            : c
        );

        const notifications = computeNotifications(
          s.indicatorFields[s.currentStage],
          materials,
          s.schoolInfo.consistencyCheck.issues,
          s.currentStage
        );

        const overallPercentage = computeOverallPercentage(
          s.indicatorFields[s.currentStage],
          materials,
          s.checklist,
          s.schoolInfo.consistencyCheck.passed
        );

        // 更新审核清单备注
        const remark = computeChecklistRemark(materials);
        const checklist = s.checklist.map((c) =>
          c.id === "cl3" ? { ...c, remark } : c
        );

        const next = {
          materials,
          notifications,
          progress: { ...s.progress, overallPercentage },
          checklist,
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    // 删除材料文件
    removeMaterialFile: (categoryId, fileId) =>
      set((s) => {
        const materials = s.materials.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                files: c.files.filter((f) => f.id !== fileId),
                uploadedCount: Math.max(0, c.uploadedCount - 1),
              }
            : c
        );

        const notifications = computeNotifications(
          s.indicatorFields[s.currentStage],
          materials,
          s.schoolInfo.consistencyCheck.issues,
          s.currentStage
        );

        const overallPercentage = computeOverallPercentage(
          s.indicatorFields[s.currentStage],
          materials,
          s.checklist,
          s.schoolInfo.consistencyCheck.passed
        );

        const remark = computeChecklistRemark(materials);
        const checklist = s.checklist.map((c) =>
          c.id === "cl3" ? { ...c, remark } : c
        );

        const next = {
          materials,
          notifications,
          progress: { ...s.progress, overallPercentage },
          checklist,
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    updateRectificationStatus: (id, status) =>
      set((s) => {
        const next = {
          rectifications: s.rectifications.map((r) =>
            r.id === id
              ? { ...r, status, updatedAt: new Date().toISOString() }
              : r
          ),
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    addRectificationComment: (id, content) =>
      set((s) => {
        const next = {
          rectifications: s.rectifications.map((r) =>
            r.id === id
              ? {
                  ...r,
                  comments: [
                    ...r.comments,
                    {
                      id: `rc-new-${Date.now()}`,
                      author: "李经办",
                      role: "学校经办人",
                      content,
                      createdAt: new Date().toLocaleString("zh-CN"),
                    },
                  ],
                }
              : r
          ),
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    markNotificationRead: (id) =>
      set((s) => {
        const next = {
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        };
        return next;
      }),

    markAllNotificationsRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),

    toggleChecklistItem: (id) =>
      set((s) => {
        const checklist = s.checklist.map((c) =>
          c.id === id ? { ...c, checked: !c.checked } : c
        );
        const overallPercentage = computeOverallPercentage(
          s.indicatorFields[s.currentStage],
          s.materials,
          checklist,
          s.schoolInfo.consistencyCheck.passed
        );
        const next = {
          checklist,
          progress: { ...s.progress, overallPercentage },
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    applyLastYearData: () =>
      set((s) => {
        const newInfo = {
          ...s.schoolInfo,
          buildingArea: licensedBaseline.buildingArea,
          licenseNumber: licensedBaseline.licenseNumber,
          legalPerson: licensedBaseline.legalPerson,
          legalPersonIdCard: licensedBaseline.legalPersonIdCard,
        };
        const issues = runConsistencyCheck(newInfo);
        newInfo.consistencyCheck = { passed: issues.length === 0, issues };

        const notifications = computeNotifications(
          s.indicatorFields[s.currentStage],
          s.materials,
          issues,
          s.currentStage
        );

        const overallPercentage = computeOverallPercentage(
          s.indicatorFields[s.currentStage],
          s.materials,
          s.checklist,
          issues.length === 0
        );

        const timeline = [
          ...s.timeline,
          {
            id: `t-new-${Date.now()}`,
            time: new Date().toLocaleString("zh-CN"),
            action: "沿用上年度数据",
            operator: "李经办",
            detail: "已将上年度备案信息应用至本年度年检申报。",
            type: "success" as const,
          },
        ];

        const next = {
          schoolInfo: newInfo,
          notifications,
          progress: { ...s.progress, overallPercentage },
          timeline,
        };
        saveToStorage({ ...s, ...next });
        return next;
      }),

    submitInspection: () => {
      const s = get();
      const allChecked = s.checklist.filter((c) => c.required).every((c) => c.checked);
      if (!allChecked) return;

      set({
        progress: {
          ...s.progress,
          currentStage: 5,
          stageStatuses: ["completed", "completed", "completed", "completed", "current", "pending"],
          overallPercentage: 85,
        },
        timeline: [
          ...s.timeline,
          {
            id: `t-submit-${Date.now()}`,
            time: new Date().toLocaleString("zh-CN"),
            action: "正式提交年检申报",
            operator: "王校长",
            detail:
              "校内审核全部通过，已向浦东新区教育局正式提交 2025 年度年检申报材料。",
            type: "success" as const,
          },
        ],
      });
    },

    refreshDerivedData: () => {
      const s = get();
      const issues = runConsistencyCheck(s.schoolInfo);
      const notifications = computeNotifications(
        s.indicatorFields[s.currentStage],
        s.materials,
        issues,
        s.currentStage
      );
      const overallPercentage = computeOverallPercentage(
        s.indicatorFields[s.currentStage],
        s.materials,
        s.checklist,
        issues.length === 0
      );
      const remark = computeChecklistRemark(s.materials);
      const checklist = s.checklist.map((c) =>
        c.id === "cl3" ? { ...c, remark } : c
      );

      set({
        notifications,
        progress: { ...s.progress, overallPercentage },
        checklist,
      });
    },
  };
});