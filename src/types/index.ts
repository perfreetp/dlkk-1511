
export type SchoolStage =
  | "primary"
  | "junior"
  | "senior"
  | "vocational"
  | "kindergarten"
  | "training";

export type RectificationStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "passed"
  | "retry";

export type InspectionResult =
  | "passed"
  | "conditional_passed"
  | "need_rectify"
  | "rejected";

export type NotificationType = "missing" | "error" | "deadline" | "info";

export interface ChargingItem {
  id: string;
  name: string;
  standard: string;
  unit: string;
  approvalNumber: string;
}

export interface ConsistencyIssue {
  field: string;
  fieldLabel: string;
  currentValue: string;
  expectedValue: string;
  severity: "warning" | "error";
  message: string;
}

export interface ConsistencyCheckResult {
  passed: boolean;
  issues: ConsistencyIssue[];
}

export interface SchoolBasicInfo {
  id: string;
  schoolName: string;
  schoolStage: SchoolStage;
  unifiedCreditCode: string;
  licenseNumber: string;
  organizer: string;
  principal: string;
  legalPerson: string;
  legalPersonIdCard: string;
  businessScope: string[];
  licenseValidFrom: string;
  licenseValidTo: string;
  schoolAddress: string;
  buildingArea: number;
  propertyType: "owned" | "leased" | "cooperative";
  chargingItems: ChargingItem[];
  consistencyCheck: ConsistencyCheckResult;
}

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
}

export interface IndicatorCategory {
  id: string;
  name: string;
  icon: string;
  totalItems: number;
  completedItems: number;
}

export interface IndicatorField {
  id: string;
  categoryId: string;
  label: string;
  type: "text" | "number" | "select" | "date" | "textarea" | "boolean";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  unit?: string;
  validationRules?: ValidationRule[];
  value?: any;
  error?: string;
}

export interface MaterialFile {
  id: string;
  categoryId: string;
  name: string;
  size: number;
  type: string;
  uploadTime: string;
  uploader: string;
  status: "uploaded" | "checking" | "passed" | "rejected";
  previewUrl?: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  icon: string;
  required: boolean;
  uploadedCount: number;
  requiredCount: number;
  files: MaterialFile[];
  description: string;
}

export interface DiffItem {
  field: string;
  oldValue: string;
  newValue: string;
  changed: boolean;
}

export interface RectificationComment {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: string;
  attachments?: MaterialFile[];
}

export interface RectificationItem {
  id: string;
  title: string;
  description: string;
  suggestion: string;
  deadline: string;
  status: RectificationStatus;
  responsible: string;
  createdAt: string;
  updatedAt: string;
  comments: RectificationComment[];
  diffData?: DiffItem[];
}

export interface ProgressOverview {
  currentStage: number;
  totalStages: number;
  stageNames: string[];
  stageStatuses: ("completed" | "current" | "pending")[];
  overallPercentage: number;
  submissionDeadline: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  deadline?: string;
}

export interface ChecklistItem {
  id: string;
  content: string;
  checked: boolean;
  required: boolean;
  remark?: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  action: string;
  operator: string;
  detail: string;
  type: "info" | "success" | "warning" | "error";
}

export interface HistoryRecord {
  year: string;
  result: InspectionResult;
  receiptNumber: string;
  reviewDate: string;
}

export interface InspectionReceipt {
  id: string;
  receiptNumber: string;
  schoolName: string;
  schoolStage: SchoolStage;
  submissionDate: string;
  inspectionYear: string;
  result: InspectionResult;
  resultDescription: string;
  reviewComments: string;
  reviewer: string;
  reviewDate: string;
  electronicSeal: string;
  historyRecords: HistoryRecord[];
}

export const SCHOOL_STAGE_OPTIONS: { value: SchoolStage; label: string }[] = [
  { value: "primary", label: "小学" },
  { value: "junior", label: "初中" },
  { value: "senior", label: "高中" },
  { value: "vocational", label: "中职" },
  { value: "kindergarten", label: "幼儿园" },
  { value: "training", label: "培训机构" },
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: "owned", label: "自有产权" },
  { value: "leased", label: "租赁" },
  { value: "cooperative", label: "合作使用" },
];

export const RECTIFICATION_STATUS_MAP: Record<
  RectificationStatus,
  { label: string; color: string }
> = {
  pending: { label: "待整改", color: "bg-warning-100 text-warning-700" },
  in_progress: { label: "整改中", color: "bg-primary-100 text-primary-700" },
  submitted: { label: "已提交", color: "bg-blue-100 text-blue-700" },
  passed: { label: "已通过", color: "bg-success-100 text-success-700" },
  retry: { label: "需再整改", color: "bg-danger-100 text-danger-700" },
};

export const INSPECTION_RESULT_MAP: Record<
  InspectionResult,
  { label: string; color: string }
> = {
  passed: { label: "年检通过", color: "bg-success-100 text-success-700" },
  conditional_passed: {
    label: "有条件通过",
    color: "bg-warning-100 text-warning-700",
  },
  need_rectify: {
    label: "需整改后再审",
    color: "bg-primary-100 text-primary-700",
  },
  rejected: { label: "不予通过", color: "bg-danger-100 text-danger-700" },
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const formatDateTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const daysUntil = (dateStr: string): number => {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
};
