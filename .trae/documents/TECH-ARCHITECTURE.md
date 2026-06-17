
## 1. 架构设计

### 1.1 系统分层架构图

```mermaid
graph TB
    subgraph "前端应用层"
        A1["6大页面组件<br/>(基础信息/指标填报/材料上传/整改跟踪/进度中心/结果回执)"]
        A2["公共UI组件库<br/>(表单/上传/卡片/徽章/弹窗/时间轴)"]
        A3["状态管理层<br/>(Zustand Store)"]
        A4["路由层<br/>(React Router)"]
    end
    
    subgraph "服务交互层"
        B1["HTTP客户端封装<br/>(fetch拦截器/错误处理)"]
        B2["API接口定义<br/>(TypeScript类型约束)"]
    end
    
    subgraph "后端服务层"
        C1["Express.js API Server"]
        C2["业务逻辑层<br/>(年检流程/校验规则/状态流转)"]
        C3["Mock数据服务层"]
    end
    
    subgraph "数据层"
        D1["内存数据存储<br/>(学校信息/指标数据/材料记录/整改记录)"]
        D2["文件存储模拟<br/>(本地路径映射)"]
    end
    
    A4 --> A1
    A1 --> A2
    A1 --> A3
    A3 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D1
    C3 --> D2
```

### 1.2 页面导航结构

```mermaid
graph LR
    Z["主入口"] --> A["基础信息 /basic-info"]
    Z --> B["指标填报 /indicators"]
    Z --> C["材料上传 /materials"]
    Z --> D["整改跟踪 /rectification"]
    Z --> E["进度中心 /progress"]
    Z --> F["结果回执 /receipt"]
    
    B --> B1["办学条件"]
    B --> B2["师资队伍"]
    B --> B3["教育教学"]
    B --> B4["财务管理"]
    B --> B5["安全管理"]
```

---

## 2. 技术栈说明

| 层级 | 技术选择 | 版本 | 用途说明 |
|------|----------|------|----------|
| **前端框架** | React | ^18.2.0 | 组件化开发、Hooks API |
| **编程语言** | TypeScript | ^5.3.0 | 类型安全、IDE智能提示 |
| **构建工具** | Vite | ^5.0.0 | 快速开发构建、HMR热更新 |
| **CSS框架** | Tailwind CSS | ^3.4.0 | 原子化样式、快速开发UI |
| **路由管理** | React Router DOM | ^6.21.0 | 客户端路由、页面导航 |
| **状态管理** | Zustand | ^4.4.0 | 轻量级全局状态、持久化 |
| **图标库** | Lucide React | ^0.312.0 | 线性图标库、语义化图标 |
| **后端框架** | Express.js | ^4.18.0 | RESTful API 服务 |
| **后端语言** | TypeScript | ^5.3.0 | 全栈类型一致 |
| **文件上传** | Multer | ^1.4.5 | 后端文件上传处理中间件 |
| **跨域处理** | CORS | ^2.8.5 | 前后端跨域通信 |

---

## 3. 路由定义

### 3.1 前端路由表

| 路由路径 | 页面名称 | 对应组件 | 说明 |
|----------|----------|----------|------|
| `/` | 入口重定向 | Redirect | 默认重定向至基础信息页 |
| `/basic-info` | 基础信息页 | BasicInfoPage | 学校信息、许可证、法人、校舍 |
| `/indicators` | 指标填报页 | IndicatorsPage | 按学段切换表单，5大类指标 |
| `/materials` | 材料上传页 | MaterialsPage | 5大类佐证材料上传 |
| `/rectification` | 整改跟踪页 | RectificationPage | 整改事项、状态流转、差异对比 |
| `/progress` | 进度中心页 | ProgressPage | 流程进度、提醒、审核清单、时间轴 |
| `/receipt` | 结果回执页 | ReceiptPage | 回执预览、打印、历史记录 |

### 3.2 后端API路由

| HTTP方法 | 路径 | 功能 |
|----------|------|------|
| GET | `/api/school-info` | 获取学校基础信息 |
| PUT | `/api/school-info` | 更新学校基础信息 |
| POST | `/api/school-info/apply-last-year` | 沿用上年度信息 |
| GET | `/api/indicators/:schoolStage` | 获取指定学段年检指标 |
| PUT | `/api/indicators/:schoolStage` | 提交指标填报数据 |
| GET | `/api/indicators/validate` | 指标数据校验接口 |
| GET | `/api/materials/categories` | 获取材料分类列表 |
| GET | `/api/materials/list/:categoryId` | 获取指定分类文件列表 |
| POST | `/api/materials/upload/:categoryId` | 上传材料文件 |
| DELETE | `/api/materials/:fileId` | 删除材料文件 |
| GET | `/api/rectifications` | 获取整改事项列表 |
| PUT | `/api/rectifications/:id/status` | 更新整改事项状态 |
| GET | `/api/rectifications/:id/diff` | 获取差异对比数据 |
| GET | `/api/progress/overview` | 获取整体进度概览 |
| GET | `/api/progress/notifications` | 获取提醒通知列表 |
| GET | `/api/progress/checklist` | 获取校内审核清单 |
| PUT | `/api/progress/checklist/submit` | 提交校内审核清单 |
| GET | `/api/progress/timeline` | 获取操作时间轴 |
| GET | `/api/receipt/current` | 获取当前年检回执 |
| GET | `/api/receipt/history` | 获取历史年检记录 |
| POST | `/api/receipt/submit` | 正式提交申报 |

---

## 4. 共享类型定义

### 4.1 核心数据类型

```typescript
// shared/types/index.ts

export type SchoolStage = 'primary' | 'junior' | 'senior' | 'vocational' | 'kindergarten' | 'training';

export type RectificationStatus = 'pending' | 'in_progress' | 'submitted' | 'passed' | 'retry';

export type InspectionResult = 'passed' | 'conditional_passed' | 'need_rectify' | 'rejected';

export type NotificationType = 'missing' | 'error' | 'deadline' | 'info';

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
  propertyType: 'owned' | 'leased' | 'cooperative';
  chargingItems: ChargingItem[];
  consistencyCheck: ConsistencyCheckResult;
}

export interface ChargingItem {
  name: string;
  standard: string;
  unit: string;
  approvalNumber: string;
}

export interface ConsistencyCheckResult {
  passed: boolean;
  issues: ConsistencyIssue[];
}

export interface ConsistencyIssue {
  field: string;
  fieldLabel: string;
  currentValue: string;
  expectedValue: string;
  severity: 'warning' | 'error';
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
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'boolean';
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

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
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

export interface MaterialFile {
  id: string;
  categoryId: string;
  name: string;
  size: number;
  type: string;
  uploadTime: string;
  uploader: string;
  status: 'uploaded' | 'checking' | 'passed' | 'rejected';
  previewUrl?: string;
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

export interface RectificationComment {
  id: string;
  author: string;
  role: string;
  content: string;
  createdAt: string;
  attachments?: MaterialFile[];
}

export interface DiffItem {
  field: string;
  oldValue: string;
  newValue: string;
  changed: boolean;
}

export interface ProgressOverview {
  currentStage: number;
  totalStages: number;
  stageNames: string[];
  stageStatuses: ('completed' | 'current' | 'pending')[];
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
  type: 'info' | 'success' | 'warning' | 'error';
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

export interface HistoryRecord {
  year: string;
  result: InspectionResult;
  receiptNumber: string;
  reviewDate: string;
}
```

---

## 5. 服务器架构（后端分层）

```mermaid
graph TD
    A["HTTP请求<br/>Express Routes"] --> B["路由层<br/>Routes"]
    B --> C["中间件层<br/>Middleware (CORS/BodyParser/Logger)"]
    C --> D["控制器层<br/>Controllers (请求/响应处理)"]
    D --> E["服务层<br/>Services (业务逻辑)"]
    E --> F["数据访问层<br/>Repositories (数据读写)"]
    F --> G["内存数据层<br/>Mock Data Store"]
    E --> H["校验层<br/>Validators (字段校验/一致性)"]
    E --> I["状态机层<br/>State Machines (整改/流程状态流转)"]
```

### 5.1 后端目录结构

```
api/
├── index.ts                 # Express 服务入口
├── routes/                  # 路由定义
│   ├── schoolInfo.ts
│   ├── indicators.ts
│   ├── materials.ts
│   ├── rectification.ts
│   ├── progress.ts
│   └── receipt.ts
├── controllers/             # 控制器（请求处理）
│   ├── SchoolInfoController.ts
│   ├── IndicatorsController.ts
│   ├── MaterialsController.ts
│   ├── RectificationController.ts
│   ├── ProgressController.ts
│   └── ReceiptController.ts
├── services/                # 服务层（业务逻辑）
│   ├── SchoolInfoService.ts
│   ├── IndicatorsService.ts
│   ├── MaterialsService.ts
│   ├── RectificationService.ts
│   ├── ProgressService.ts
│   └── ReceiptService.ts
├── validators/              # 校验层
│   ├── SchoolInfoValidator.ts
│   └── IndicatorsValidator.ts
├── mock/                    # Mock 数据
│   ├── schoolInfo.ts
│   ├── indicators.ts
│   ├── materials.ts
│   ├── rectification.ts
│   ├── progress.ts
│   └── receipt.ts
└── utils/                   # 工具函数
    ├── response.ts
    ├── validator.ts
    └── storage.ts
```

---

## 6. 数据模型

### 6.1 ER 关系图

```mermaid
erDiagram
    SCHOOL_BASIC_INFO ||--o{ CHARGING_ITEM : contains
    SCHOOL_BASIC_INFO ||--o| CONSISTENCY_CHECK : has
    SCHOOL_BASIC_INFO ||--o{ INDICATOR_FIELD : "fills by stage"
    INDICATOR_CATEGORY ||--o{ INDICATOR_FIELD : contains
    MATERIAL_CATEGORY ||--o{ MATERIAL_FILE : contains
    RECTIFICATION_ITEM ||--o{ RECTIFICATION_COMMENT : has
    RECTIFICATION_ITEM ||--o{ DIFF_ITEM : has
    PROGRESS_CHECKLIST ||--o{ CHECKLIST_ITEM : contains
    INSPECTION_RECEIPT ||--o{ HISTORY_RECORD : has
    SCHOOL_BASIC_INFO }o--|| PROGRESS_OVERVIEW : "one to one"
    SCHOOL_BASIC_INFO }o--|| INSPECTION_RECEIPT : "one to one"
    NOTIFICATION_ITEM }o--|| PROGRESS_OVERVIEW : "belongs to"
    TIMELINE_ITEM }o--|| PROGRESS_OVERVIEW : "belongs to"

    SCHOOL_BASIC_INFO {
        string id PK
        string schoolName
        enum schoolStage
        string unifiedCreditCode
        string licenseNumber
        string organizer
        string principal
        string legalPerson
        number buildingArea
    }
```

### 6.2 核心数据说明

| 数据实体 | 关键字段 | 存储策略 |
|----------|----------|----------|
| 学校基础信息 | 学校名称、学段、信用代码、许可证号、法人、校舍面积 | 单条记录，支持沿用上年度 |
| 年检指标 | 按学段分类，每类20-30个字段，多种数据类型 | 按学段分组存储，值随用户填报实时更新 |
| 佐证材料 | 5大分类，每个分类多个文件，含名称/大小/类型/状态 | 分类文件夹结构，文件元数据记录 |
| 整改事项 | 事项描述、整改建议、截止日期、状态、责任人、差异数据 | 状态机流转，历史操作记录完整 |
| 进度数据 | 6阶段进度、通知、审核清单、时间轴 | 聚合计算生成，时间轴追加式存储 |
| 年检回执 | 回执编号、结论、审查意见、电子签章、历史记录 | 正式提交后生成不可变，历史记录追加 |
