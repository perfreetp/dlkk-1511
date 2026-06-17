
import { useState, useRef, useMemo } from "react";
import {
  Upload,
  FileText,
  Users,
  ShieldCheck,
  Wallet,
  FolderOpen,
  File,
  FileImage,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  Download,
  Plus,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/FormFields";
import { formatFileSize, MaterialCategory as TMaterialCategory, MaterialFile } from "@/types";
import { cn } from "@/components/Layout";

const CATEGORY_ICONS: Record<string, any> = {
  m1: FileText,
  m2: Wallet,
  m3: Users,
  m4: ShieldCheck,
  m5: FolderOpen,
};

const FILE_STATUS_CONFIG: Record<
  MaterialFile["status"],
  { label: string; icon: any; color: string }
> = {
  uploaded: { label: "已上传", icon: File, color: "text-slate-500 bg-slate-100" },
  checking: {
    label: "审核中",
    icon: Clock,
    color: "text-warning-600 bg-warning-100",
  },
  passed: {
    label: "审核通过",
    icon: CheckCircle2,
    color: "text-success-600 bg-success-100",
  },
  rejected: {
    label: "被退回",
    icon: AlertCircle,
    color: "text-danger-600 bg-danger-100",
  },
};

function FileIconByType({ type }: { type: string }) {
  if (type.startsWith("image/")) {
    return <FileImage className="w-5 h-5 text-warning-600" />;
  }
  if (type.includes("pdf")) {
    return <File className="w-5 h-5 text-danger-500" />;
  }
  if (type.includes("excel") || type.includes("sheet")) {
    return <File className="w-5 h-5 text-success-600" />;
  }
  return <File className="w-5 h-5 text-primary-600" />;
}

function UploadDropzone({
  category,
  onUpload,
}: {
  category: TMaterialCategory;
  onUpload: (files: FileList) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
          onUpload(e.dataTransfer.files);
        }
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300",
        isDragging
          ? "border-primary-500 bg-primary-50 scale-[1.01] shadow-card-hover"
          : "border-slate-300 bg-slate-50/50 hover:border-primary-400 hover:bg-primary-50/40"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
        className="sr-only"
        onChange={(e) =>
          e.target.files && e.target.files.length > 0 && onUpload(e.target.files)
        }
      />
      <div
        className={cn(
          "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
          isDragging
            ? "bg-primary-600 text-white shadow-card scale-110"
            : "bg-white text-primary-600 shadow-card group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-card-hover"
        )}
      >
        <Upload className="w-7 h-7" strokeWidth={1.8} />
      </div>
      <div className="mt-4 font-medium text-slate-800">
        拖拽文件到此处或
        <span className="text-primary-600 mx-1 font-semibold">点击选择文件</span>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        当前分类：{category.name} · 支持 PDF / JPG / PNG / Word / Excel · 单文件 ≤ 20MB
      </p>
    </div>
  );
}

function FileItem({
  file,
  categoryId,
  onRemove,
}: {
  file: MaterialFile;
  categoryId: string;
  onRemove: (categoryId: string, fileId: string) => void;
}) {
  const cfg = FILE_STATUS_CONFIG[file.status];
  const StatusIcon = cfg.icon;
  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-primary-200 hover:bg-primary-50/30 hover:shadow-card transition-all duration-200 animate-fade-in-up">
      <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center shadow-sm shrink-0">
        <FileIconByType type={file.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800 truncate">
            {file.name}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              cfg.color
            )}
          >
            <StatusIcon className="w-3 h-3" strokeWidth={2.4} />
            {cfg.label}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="font-mono">{formatFileSize(file.size)}</span>
          <span>·</span>
          <span>{file.uploadTime}</span>
          <span>·</span>
          <span>{file.uploader}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-primary-600 transition-colors"
          title="预览"
        >
          <Eye className="w-4 h-4" strokeWidth={1.8} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-success-600 transition-colors"
          title="下载"
        >
          <Download className="w-4 h-4" strokeWidth={1.8} />
        </button>
        <button
          onClick={() => onRemove(categoryId, file.id)}
          className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-danger-600 transition-colors"
          title="删除"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  isExpanded,
  onToggle,
  onUpload,
  onRemove,
  idx,
}: {
  category: TMaterialCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onUpload: (files: FileList) => void;
  onRemove: (cid: string, fid: string) => void;
  idx: number;
}) {
  const Icon = CATEGORY_ICONS[category.id] || FolderOpen;
  const hasMissing =
    category.required && category.uploadedCount < category.requiredCount;
  const missing = Math.max(0, category.requiredCount - category.uploadedCount);

  return (
    <div
      className={cn(
        "card overflow-hidden transition-all duration-300",
        hasMissing && "border-danger-200 shadow-card-hover"
      )}
      style={{ animation: `fade-in-up 0.5s ease-out ${idx * 50}ms both` }}
    >
      <button
        onClick={onToggle}
        className="w-full card-header !py-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-card",
              hasMissing
                ? "bg-gradient-to-br from-danger-500 to-danger-600 text-white"
                : category.uploadedCount >= category.requiredCount && category.required
                ? "bg-gradient-to-br from-success-500 to-success-600 text-white"
                : "bg-gradient-to-br from-primary-500 to-primary-600 text-white"
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
            {category.files.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-white text-[10px] font-bold text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center">
                {category.files.length}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-slate-800">
                {category.name}
              </span>
              {category.required ? (
                <span className="badge bg-primary-50 text-primary-700 border border-primary-200">
                  必传
                </span>
              ) : (
                <span className="badge bg-slate-50 text-slate-600 border border-slate-200">
                  选传
                </span>
              )}
              {hasMissing && (
                <span className="badge bg-danger-50 text-danger-700 border border-danger-200 animate-pulse">
                  缺 {missing} 项
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-slate-500 max-w-xl truncate">
              {category.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-mono font-semibold text-slate-800">
              {category.uploadedCount}
              <span className="text-slate-400">/{category.requiredCount || "∞"}</span>
            </div>
            <div className="text-[10px] text-slate-500">已上传</div>
          </div>
          <div className="w-28 hidden sm:block">
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  hasMissing
                    ? "bg-gradient-to-r from-danger-400 to-danger-500"
                    : "bg-gradient-to-r from-success-400 to-success-600"
                )}
                style={{
                  width: category.requiredCount
                    ? `${Math.min(100, (category.uploadedCount / category.requiredCount) * 100)}%`
                    : `${Math.min(100, category.uploadedCount * 20)}%`,
                }}
              />
            </div>
          </div>
          <Plus
            className={cn(
              "w-5 h-5 text-slate-400 transition-transform duration-300",
              isExpanded && "rotate-45"
            )}
            strokeWidth={1.8}
          />
        </div>
      </button>
      {isExpanded && (
        <div className="card-body !pt-0 space-y-5 border-t border-slate-100 animate-fade-in">
          <UploadDropzone category={category} onUpload={onUpload} />
          {category.files.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-500">
                  已上传文件（{category.files.length}）
                </div>
              </div>
              {category.files.map((f) => (
                <FileItem
                  key={f.id}
                  file={f}
                  categoryId={category.id}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MaterialsPage() {
  const { materials, addMaterialFile, removeMaterialFile } = useAppStore();
  const [expanded, setExpanded] = useState<string>("m1");

  const summary = useMemo(() => {
    let required = 0;
    let uploaded = 0;
    for (const m of materials) {
      required += m.requiredCount || 0;
      uploaded += Math.min(m.uploadedCount, m.requiredCount || m.uploadedCount);
    }
    const missing = Math.max(0, required - uploaded);
    const total = materials.reduce((acc, m) => acc + m.files.length, 0);
    return { required, uploaded, missing, total, percent: required ? Math.round((uploaded / required) * 100) : 0 };
  }, [materials]);

  const handleUpload = (categoryId: string, files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      addMaterialFile(categoryId, files[i]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Upload className="w-6 h-6" strokeWidth={2} />}
        title="佐证材料上传"
        subtitle="按分类上传年检所需的各类佐证材料，包括证照、财务、师资、安保等。必传材料上传完成后方可提交。支持拖拽批量上传。"
        extra={
          <div className="card !shadow-none border-0 bg-gradient-to-br from-primary-50 to-success-50 p-4 border border-primary-100">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <svg viewBox="0 0 36 36" className="-rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeDasharray={`${summary.percent}, 100`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-700 font-mono">
                    {summary.percent}%
                  </span>
                </div>
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="text-slate-600">
                  必传材料
                  <span className="font-mono font-bold text-slate-800 mx-1">
                    {summary.uploaded}
                  </span>
                  / {summary.required}
                </div>
                {summary.missing > 0 && (
                  <div className="text-danger-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    尚缺 {summary.missing} 项
                  </div>
                )}
                <div className="text-slate-500">共上传 {summary.total} 个文件</div>
              </div>
            </div>
          </div>
        }
        steps={[
          { label: "基础信息", status: "completed" },
          { label: "指标填报", status: "completed" },
          { label: "材料上传", status: "current" },
          { label: "校内审核", status: "pending" },
          { label: "教育局审查", status: "pending" },
          { label: "年检完成", status: "pending" },
        ]}
      />

      <div className="space-y-4">
        {materials.map((m, idx) => (
          <CategoryCard
            key={m.id}
            category={m}
            idx={idx}
            isExpanded={expanded === m.id}
            onToggle={() =>
              setExpanded((prev) => (prev === m.id ? "" : m.id))
            }
            onUpload={(files) => handleUpload(m.id, files)}
            onRemove={removeMaterialFile}
          />
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pb-4 no-print">
        <button className="btn-secondary">保存草稿</button>
        <button className="btn-primary px-6 py-2.5">
          完成上传，进入校内审核
          <X className="w-0 h-0" />
        </button>
      </div>
    </div>
  );
}
