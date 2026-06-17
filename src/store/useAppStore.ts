
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
} from "@/types";

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
    {
      id: "ci1",
      name: "学杂费",
      standard: "18000",
      unit: "元/学期",
      approvalNumber: "浦发改价[2023]89号",
    },
    {
      id: "ci2",
      name: "住宿费",
      standard: "4200",
      unit: "元/学期",
      approvalNumber: "浦发改价[2023]90号",
    },
    {
      id: "ci3",
      name: "伙食费",
      standard: "30",
      unit: "元/天",
      approvalNumber: "浦发改价[2023]91号",
    },
  ],
  consistencyCheck: {
    passed: false,
    issues: [
      {
        field: "buildingArea",
        fieldLabel: "校舍建筑面积",
        currentValue: "18500",
        expectedValue: "20000",
        severity: "warning",
        message: "当前填报面积与办学许可证记载面积 20000㎡ 存在差异，请确认是否有改扩建备案。",
      },
    ],
  },
};

const mockIndicatorCategories: IndicatorCategory[] = [
  { id: "c1", name: "办学条件", icon: "Building2", totalItems: 8, completedItems: 6 },
  { id: "c2", name: "师资队伍", icon: "Users", totalItems: 10, completedItems: 8 },
  { id: "c3", name: "教育教学", icon: "GraduationCap", totalItems: 7, completedItems: 7 },
  { id: "c4", name: "财务管理", icon: "Wallet", totalItems: 6, completedItems: 4 },
  { id: "c5", name: "安全管理", icon: "ShieldCheck", totalItems: 9, completedItems: 9 },
];

const makeIndicatorFields = (stage: SchoolStage): IndicatorField[] => {
  const base: IndicatorField[] = [
    {
      id: "f1",
      categoryId: "c1",
      label: "校园占地面积",
      type: "number",
      required: true,
      unit: "㎡",
      min: 5000,
      placeholder: "请输入占地面积",
      value: 28600,
      validationRules: [{ type: "min", value: 5000, message: "占地面积不得小于 5000㎡" }],
    },
    {
      id: "f2",
      categoryId: "c1",
      label: "教学及辅助用房面积",
      type: "number",
      required: true,
      unit: "㎡",
      placeholder: "请输入教学用房面积",
      value: 12800,
    },
    {
      id: "f3",
      categoryId: "c1",
      label: "普通教室数量",
      type: "number",
      required: true,
      unit: "间",
      min: 12,
      value: 36,
    },
    {
      id: "f4",
      categoryId: "c1",
      label: "专用实验室数量",
      type: "number",
      required: false,
      unit: "间",
      value: 8,
    },
    {
      id: "f5",
      categoryId: "c1",
      label: "图书馆藏书量",
      type: "number",
      required: true,
      unit: "册",
      min: 3000,
      value: 48500,
    },
    {
      id: "f6",
      categoryId: "c1",
      label: "体育运动场地面积",
      type: "number",
      required: true,
      unit: "㎡",
      value: 6200,
    },
    {
      id: "f7",
      categoryId: "c1",
      label: "是否有标准环形跑道",
      type: "select",
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
      type: "number",
      required: true,
      unit: "万元",
      value: null,
      validationRules: [{ type: "required", message: "请填写教学仪器设备总值" }],
      error: "请填写教学仪器设备总值",
    },
    {
      id: "f9",
      categoryId: "c2",
      label: "教职工总人数",
      type: "number",
      required: true,
      unit: "人",
      value: 156,
    },
    {
      id: "f10",
      categoryId: "c2",
      label: "专任教师人数",
      type: "number",
      required: true,
      unit: "人",
      value: 118,
    },
    {
      id: "f11",
      categoryId: "c2",
      label: "教师本科学历以上比例",
      type: "number",
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
      type: "number",
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
      type: "number",
      required: true,
      unit: "1:X",
      min: 5,
      max: 25,
      value: 12.6,
    },
    {
      id: "f14",
      categoryId: "c2",
      label: "双师型教师数量",
      type: "number",
      required: false,
      unit: "人",
      value: 0,
    },
    {
      id: "f15",
      categoryId: "c2",
      label: "本年度教师培训经费",
      type: "number",
      required: true,
      unit: "万元",
      value: 32.5,
    },
    {
      id: "f16",
      categoryId: "c2",
      label: "教师参加继续教育完成率",
      type: "number",
      required: true,
      unit: "%",
      value: 98,
    },
    {
      id: "f17",
      categoryId: "c2",
      label: "是否有师德师风专项制度",
      type: "boolean",
      required: true,
      value: true,
    },
    {
      id: "f18",
      categoryId: "c2",
      label: "教师持证上岗率",
      type: "number",
      required: true,
      unit: "%",
      value: 100,
    },
    {
      id: "f19",
      categoryId: "c3",
      label: "在校学生总数",
      type: "number",
      required: true,
      unit: "人",
      value: 1488,
    },
    {
      id: "f20",
      categoryId: "c3",
      label: "班级数量",
      type: "number",
      required: true,
      unit: "个",
      value: 36,
    },
    {
      id: "f21",
      categoryId: "c3",
      label: "平均班额",
      type: "number",
      required: true,
      unit: "人",
      max: 55,
      value: 41.3,
    },
    {
      id: "f22",
      categoryId: "c3",
      label: "课程方案执行情况",
      type: "select",
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
      type: "number",
      required: true,
      unit: "%",
      value: 93.2,
    },
    {
      id: "f24",
      categoryId: "c3",
      label: "学业水平考试合格率",
      type: "number",
      required: true,
      unit: "%",
      value: 96.8,
    },
    {
      id: "f25",
      categoryId: "c3",
      label: "德育工作专项总结",
      type: "textarea",
      required: true,
      placeholder: "请简要描述本年度德育工作开展情况...",
      value:
        "本年度学校坚持立德树人根本任务，建立以爱国主义、集体主义、社会主义教育为主线的德育体系，开展主题班会 48 次、校外实践活动 12 次、心理健康辅导 36 场。",
    },
    {
      id: "f26",
      categoryId: "c4",
      label: "学校总资产",
      type: "number",
      required: true,
      unit: "万元",
      value: null,
      validationRules: [{ type: "required", message: "请填写学校总资产" }],
      error: "请填写学校总资产",
    },
    {
      id: "f27",
      categoryId: "c4",
      label: "净资产",
      type: "number",
      required: true,
      unit: "万元",
      value: null,
      error: "请填写净资产",
    },
    {
      id: "f28",
      categoryId: "c4",
      label: "本年度总收入",
      type: "number",
      required: true,
      unit: "万元",
      value: 5280,
    },
    {
      id: "f29",
      categoryId: "c4",
      label: "本年度总支出",
      type: "number",
      required: true,
      unit: "万元",
      value: 4920,
    },
    {
      id: "f30",
      categoryId: "c4",
      label: "是否经会计师事务所审计",
      type: "boolean",
      required: true,
      value: true,
    },
    {
      id: "f31",
      categoryId: "c4",
      label: "审计意见",
      type: "select",
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
    {
      id: "f32",
      categoryId: "c5",
      label: "安全管理机构是否健全",
      type: "boolean",
      required: true,
      value: true,
    },
    {
      id: "f33",
      categoryId: "c5",
      label: "专职保安人员数量",
      type: "number",
      required: true,
      unit: "人",
      min: 6,
      value: 14,
    },
    {
      id: "f34",
      categoryId: "c5",
      label: "一键式紧急报警装置",
      type: "boolean",
      required: true,
      value: true,
    },
    {
      id: "f35",
      categoryId: "c5",
      label: "视频监控覆盖率",
      type: "number",
      required: true,
      unit: "%",
      value: 100,
    },
    {
      id: "f36",
      categoryId: "c5",
      label: "消防设施是否年检合格",
      type: "boolean",
      required: true,
      value: true,
    },
    {
      id: "f37",
      categoryId: "c5",
      label: "校车数量（如无填0）",
      type: "number",
      required: true,
      unit: "辆",
      value: 12,
    },
    {
      id: "f38",
      categoryId: "c5",
      label: "本年度安全演练次数",
      type: "number",
      required: true,
      unit: "次",
      min: 4,
      value: 8,
    },
    {
      id: "f39",
      categoryId: "c5",
      label: "学生食品安全量化等级",
      type: "select",
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
      type: "number",
      required: true,
      unit: "起",
      value: 0,
    },
  ];
  return base;
};

const mockMaterials: MaterialCategory[] = [
  {
    id: "m1",
    name: "证照类材料",
    icon: "Certificate",
    required: true,
    uploadedCount: 4,
    requiredCount: 5,
    description:
      "办学许可证、法人登记证、组织机构代码证、收费许可证、校长任职资格证等",
    files: [
      {
        id: "f-001",
        categoryId: "m1",
        name: "办学许可证（正本）.pdf",
        size: 2485760,
        type: "application/pdf",
        uploadTime: "2026-05-28 10:23",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-002",
        categoryId: "m1",
        name: "民办非企业单位登记证书.pdf",
        size: 1834496,
        type: "application/pdf",
        uploadTime: "2026-05-28 10:25",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-003",
        categoryId: "m1",
        name: "税务登记证.jpg",
        size: 983040,
        type: "image/jpeg",
        uploadTime: "2026-05-28 10:28",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-004",
        categoryId: "m1",
        name: "校长资格证.pdf",
        size: 1257472,
        type: "application/pdf",
        uploadTime: "2026-05-28 14:12",
        uploader: "李经办",
        status: "checking",
      },
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
      {
        id: "f-101",
        categoryId: "m2",
        name: "2025年度审计报告.pdf",
        size: 5242880,
        type: "application/pdf",
        uploadTime: "2026-06-02 09:15",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-102",
        categoryId: "m2",
        name: "资产负债表.xlsx",
        size: 144384,
        type: "application/vnd.ms-excel",
        uploadTime: "2026-06-02 09:18",
        uploader: "李经办",
        status: "uploaded",
      },
      {
        id: "f-103",
        categoryId: "m2",
        name: "收费项目备案表.pdf",
        size: 1048576,
        type: "application/pdf",
        uploadTime: "2026-06-02 09:22",
        uploader: "李经办",
        status: "passed",
      },
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
      {
        id: "f-201",
        categoryId: "m3",
        name: "教职工花名册.xlsx",
        size: 209920,
        type: "application/vnd.ms-excel",
        uploadTime: "2026-06-05 15:40",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-202",
        categoryId: "m3",
        name: "教师资格证清单汇总.pdf",
        size: 8388608,
        type: "application/pdf",
        uploadTime: "2026-06-05 15:45",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-203",
        categoryId: "m3",
        name: "社保缴纳证明（全年）.pdf",
        size: 4194304,
        type: "application/pdf",
        uploadTime: "2026-06-05 16:00",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-204",
        categoryId: "m3",
        name: "教师继续教育学分证明.pdf",
        size: 3670016,
        type: "application/pdf",
        uploadTime: "2026-06-05 16:08",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-205",
        categoryId: "m3",
        name: "师德师风考核结果.pdf",
        size: 2097152,
        type: "application/pdf",
        uploadTime: "2026-06-05 16:15",
        uploader: "李经办",
        status: "checking",
      },
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
      {
        id: "f-301",
        categoryId: "m4",
        name: "消防设施年度检测报告.pdf",
        size: 3145728,
        type: "application/pdf",
        uploadTime: "2026-06-08 10:05",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-302",
        categoryId: "m4",
        name: "保安员资格证汇总.pdf",
        size: 4718592,
        type: "application/pdf",
        uploadTime: "2026-06-08 10:10",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-303",
        categoryId: "m4",
        name: "校园一键报警联网证明.pdf",
        size: 524288,
        type: "application/pdf",
        uploadTime: "2026-06-08 10:15",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-304",
        categoryId: "m4",
        name: "校车行驶证及保险单.pdf",
        size: 2621440,
        type: "application/pdf",
        uploadTime: "2026-06-08 10:20",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-305",
        categoryId: "m4",
        name: "安全应急预案汇编.pdf",
        size: 1572864,
        type: "application/pdf",
        uploadTime: "2026-06-08 10:25",
        uploader: "李经办",
        status: "passed",
      },
      {
        id: "f-306",
        categoryId: "m4",
        name: "本年度演练记录台账.pdf",
        size: 2097152,
        type: "application/pdf",
        uploadTime: "2026-06-08 10:30",
        uploader: "李经办",
        status: "passed",
      },
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
      {
        id: "f-401",
        categoryId: "m5",
        name: "党支部年度工作总结.pdf",
        size: 1048576,
        type: "application/pdf",
        uploadTime: "2026-06-10 14:00",
        uploader: "李经办",
        status: "uploaded",
      },
      {
        id: "f-402",
        categoryId: "m5",
        name: "本年度获奖情况汇总.pdf",
        size: 3670016,
        type: "application/pdf",
        uploadTime: "2026-06-10 14:10",
        uploader: "李经办",
        status: "uploaded",
      },
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
      {
        id: "rc1",
        author: "赵审查",
        role: "教育局审查员",
        content:
          "根据办学许可证副本记载，校舍面积应为 20000㎡。请学校补充说明 2024 年 7 月东侧教学楼拆除后的权属变更情况，并附上改扩建备案文件。",
        createdAt: "2026-06-15 09:30",
      },
      {
        id: "rc2",
        author: "李经办",
        role: "学校经办人",
        content:
          "收到！2024 年 8 月学校因市政工程对东侧附楼进行了部分拆除（约 1500㎡），相关备案文件正在整理扫描，预计明日上传。",
        createdAt: "2026-06-16 11:08",
      },
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
    comments: [
      {
        id: "rc3",
        author: "赵审查",
        role: "教育局审查员",
        content: "必填项缺失，请尽快补充。",
        createdAt: "2026-06-15 09:32",
      },
    ],
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
      {
        id: "rc4",
        author: "钱审查",
        role: "教育局审查员",
        content: "缺少收费许可证，请补充。",
        createdAt: "2026-06-12 14:20",
      },
      {
        id: "rc5",
        author: "李经办",
        role: "学校经办人",
        content: "已上传浦发改价[2023]89-91号三份备案表，请查收。",
        createdAt: "2026-06-13 16:45",
      },
      {
        id: "rc6",
        author: "钱审查",
        role: "教育局审查员",
        content: "材料已审核通过。",
        createdAt: "2026-06-14 10:15",
      },
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

const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "deadline",
    title: "距年检申报截止还剩 12 天",
    message: "2025 年度民办学校年检申报将于 2026-06-30 截止，请在截止日前完成报送。",
    read: false,
    createdAt: "2026-06-18 08:00",
    deadline: "2026-06-30",
  },
  {
    id: "n2",
    type: "error",
    title: "指标填报存在 2 项错项",
    message: "【教学仪器设备总值】和【学校总资产】字段尚未填写，请尽快补充。",
    read: false,
    createdAt: "2026-06-17 16:30",
  },
  {
    id: "n3",
    type: "missing",
    title: "材料存在 2 项缺项",
    message: "证照类缺少 1 份必传材料，财务类缺少 1 份必传材料。",
    read: false,
    createdAt: "2026-06-17 15:10",
  },
  {
    id: "n4",
    type: "info",
    title: "收到 2 条整改事项",
    message: "教育局审查员于 2026-06-15 提出 2 条整改意见，请及时处理。",
    read: true,
    createdAt: "2026-06-15 09:35",
  },
];

const mockChecklist: ChecklistItem[] = [
  {
    id: "cl1",
    content: "学校基础信息已核对无误，办学许可证、法人信息一致。",
    checked: true,
    required: true,
  },
  {
    id: "cl2",
    content: "年检指标填报数据已逐项复核，数字准确，逻辑合理。",
    checked: true,
    required: true,
  },
  {
    id: "cl3",
    content: "所有必传佐证材料已上传，文件清晰完整。",
    checked: false,
    required: true,
    remark: "证照类尚缺 1 份、财务类尚缺 1 份，需补充。",
  },
  {
    id: "cl4",
    content: "财务数据经会计师事务所审计，审计意见为标准无保留。",
    checked: true,
    required: true,
  },
  {
    id: "cl5",
    content: "学校本年度不存在重大安全事故、违规办学、群体性事件。",
    checked: true,
    required: true,
  },
  {
    id: "cl6",
    content: "已阅读《民办学校年检办法》，对填报信息真实性负责。",
    checked: false,
    required: true,
  },
];

const mockTimeline: TimelineItem[] = [
  {
    id: "t1",
    time: "2026-05-20 09:00",
    action: "年检任务启动",
    operator: "系统",
    detail: "2025 年度民办学校年检工作正式启动，平台已开放填报入口。",
    type: "info",
  },
  {
    id: "t2",
    time: "2026-05-28 10:15",
    action: "经办人登录",
    operator: "李经办",
    detail: "年检经办人登录平台，开始进行基础信息填报。",
    type: "info",
  },
  {
    id: "t3",
    time: "2026-06-08 16:30",
    action: "沿用上年度数据",
    operator: "李经办",
    detail: "基础信息 38 项字段中，32 项沿用了上年度备案数据。",
    type: "success",
  },
  {
    id: "t4",
    time: "2026-06-10 11:40",
    action: "材料上传完成",
    operator: "李经办",
    detail: "完成 5 大类共 20 份佐证材料上传。",
    type: "success",
  },
  {
    id: "t5",
    time: "2026-06-12 14:00",
    action: "提交初审",
    operator: "王校长",
    detail: "校长审核后提交至教育局进行初审。",
    type: "success",
  },
  {
    id: "t6",
    time: "2026-06-15 09:35",
    action: "退回补正",
    operator: "赵审查",
    detail: "教育局审查提出 3 条整改意见，请学校于 6 月 25 日前完成。",
    type: "warning",
  },
  {
    id: "t7",
    time: "2026-06-14 10:15",
    action: "整改事项通过",
    operator: "钱审查",
    detail: "证照类收费许可证缺失问题已补正，审核通过。",
    type: "success",
  },
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
    {
      year: "2024",
      result: "passed",
      receiptNumber: "沪浦教年验〔2025〕0362 号",
      reviewDate: "2025-06-18",
    },
    {
      year: "2023",
      result: "passed",
      receiptNumber: "沪浦教年验〔2024〕0298 号",
      reviewDate: "2024-06-20",
    },
    {
      year: "2022",
      result: "conditional_passed",
      receiptNumber: "沪浦教年验〔2023〕0211 号",
      reviewDate: "2023-06-22",
    },
  ],
};

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
}

export const useAppStore = create<AppState>((set, get) => ({
  schoolInfo: mockSchoolInfo,
  indicatorCategories: mockIndicatorCategories,
  indicatorFields: {
    primary: makeIndicatorFields("primary"),
    junior: makeIndicatorFields("junior"),
    senior: makeIndicatorFields("senior"),
    vocational: makeIndicatorFields("vocational"),
    kindergarten: makeIndicatorFields("kindergarten"),
    training: makeIndicatorFields("training"),
  },
  currentStage: mockSchoolInfo.schoolStage,
  materials: mockMaterials,
  rectifications: mockRectifications,
  progress: mockProgress,
  notifications: mockNotifications,
  checklist: mockChecklist,
  timeline: mockTimeline,
  receipt: mockReceipt,

  setCurrentStage: (stage) => set({ currentStage: stage }),

  updateSchoolInfo: (patch) =>
    set((s) => ({ schoolInfo: { ...s.schoolInfo, ...patch } })),

  updateIndicatorField: (fieldId, value) =>
    set((s) => {
      const stage = s.currentStage;
      const fields = s.indicatorFields[stage].map((f) =>
        f.id === fieldId ? { ...f, value, error: undefined } : f
      );
      return { indicatorFields: { ...s.indicatorFields, [stage]: fields } };
    }),

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
      return {
        materials: s.materials.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                files: [...c.files, newFile],
                uploadedCount: c.uploadedCount + 1,
              }
            : c
        ),
      };
    }),

  removeMaterialFile: (categoryId, fileId) =>
    set((s) => ({
      materials: s.materials.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              files: c.files.filter((f) => f.id !== fileId),
              uploadedCount: Math.max(0, c.uploadedCount - 1),
            }
          : c
      ),
    })),

  updateRectificationStatus: (id, status) =>
    set((s) => ({
      rectifications: s.rectifications.map((r) =>
        r.id === id
          ? { ...r, status, updatedAt: new Date().toISOString() }
          : r
      ),
    })),

  addRectificationComment: (id, content) =>
    set((s) => ({
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
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleChecklistItem: (id) =>
    set((s) => ({
      checklist: s.checklist.map((c) =>
        c.id === id ? { ...c, checked: !c.checked } : c
      ),
    })),

  applyLastYearData: () =>
    set((s) => ({
      schoolInfo: {
        ...s.schoolInfo,
        consistencyCheck: { passed: true, issues: [] },
      },
      timeline: [
        ...s.timeline,
        {
          id: `t-new-${Date.now()}`,
          time: new Date().toLocaleString("zh-CN"),
          action: "沿用上年度数据",
          operator: "李经办",
          detail: "已将上年度备案信息应用至本年度年检申报。",
          type: "success" as const,
        },
      ],
    })),

  submitInspection: () => {
    const s = get();
    const allChecked = s.checklist.filter((c) => c.required).every((c) => c.checked);
    if (!allChecked) {
      return;
    }
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
}));
