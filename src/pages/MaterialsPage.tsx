
import { useState, useRef, useMemo } from "react";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  File,
  FileImage,
  FileSpreadsheet,
  FileJson,
  XCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { PageHeader } from "@/components/FormFields";
import { cn } from "@/components/Layout";
import { MaterialFile, formatFileSize } from "@/types";

export default function MaterialsPage() {
  const { materials, addMaterialFile, removeMaterialFile } = useAppStore();

  const [previewFile, setPreviewFile] = useState<MaterialFile | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { totalMaterialCount, totalMissingCount, totalUploaded } = useMemo(() => {
    let total = 0;
    let missing = 0;
    for (const m of materials) {
      if (m.required) {
        total += m.requiredCount;
        missing += Math.max(0, m.requiredCount - m.uploadedCount);
      }
    }
    return {
      totalMaterialCount: total,
      totalMissingCount: missing,
      totalUploaded: total - missing,
    };
  }, [materials]);

  const handleFileUpload = (categoryId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      addMaterialFile(categoryId, file);
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="w-5 h-5" />;
    if (type.includes("pdf")) return <FileText className="w-5 h-5" />;
    if (type.includes("sheet") || type.includes("excel"))
      return <FileSpreadsheet className="w-5 h-5" />;
    if (type.includes("json")) return <FileJson className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      uploaded: {
        label: "已上传",
        className: "bg-success-50 text-success-700 border-success-200",
      },
      checking: {
        label: "审核中",
        className: "bg-primary-50 text-primary-700 border-primary-200",
      },
      passed: {
        label: "已通过",
        className: "bg-success-50 text-success-700 border-success-200",
      },
      rejected: {
        label: "已退回",
        className: "bg-danger-50 text-danger-700 border-danger-200",
      },
      pending: {
        label: "待上传",
        className: "bg-slate-50 text-slate-500 border-slate-200",
      },
      expired: {
        label: "已过期",
        className: "bg-warning-50 text-warning-700 border-warning-200",
      },
    };
    const cfg = config[status] || config.pending;
    return (
      <span
        className={cn(
          "text-xs px-2 py-0.5 rounded-md border font-medium",
          cfg.className
        )}
      >
        {cfg.label}
      </span>
    );
  };

  const isFileContentAvailable = (file: MaterialFile): boolean => {
    if (file.contentAvailable) return true;
    try {
      const stored = localStorage.getItem("minjian-material-" + file.id);
      return !!stored && stored.length > 0;
    } catch {
      return false;
    }
  };

  const handleDownload = (file: MaterialFile) => {
    let base64: string | null = null;
    try {
      base64 = localStorage.getItem("minjian-material-" + file.id);
    } catch {
      base64 = null;
    }

    if (!base64 && !file.contentAvailable) {
      alert("文件内容不可用，请重新上传");
      return;
    }

    if (!base64) {
      alert("文件内容不可用，请重新上传");
      return;
    }

    try {
      const base64Data = base64.split(",")[1] || base64;
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: file.type || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("文件下载失败，请重新上传后再试");
    }
  };

  const handleRemove = (categoryId: string, fileId: string, fileName: string) => {
    if (confirm(`确定要删除文件「${fileName}」吗？删除后需要重新上传。`)) {
      removeMaterialFile(categoryId, fileId);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Upload className="w-6 h-6" strokeWidth={2} />}
        title="材料上传"
        subtitle="请按分类上传年检所需的全部证明材料。支持拖拽上传，PDF/Word/Excel/JPG/PNG 格式均可，单文件不超过 50MB。"
        extra={
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-slate-500">已上传 / 总计</div>
              <div className="font-mono font-semibold text-slate-800">
                {totalUploaded}
                <span className="text-slate-400 mx-0.5">/</span>
                {totalMaterialCount}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-100 text-success-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">已上传材料</div>
            <div className="font-serif text-xl font-semibold text-slate-800">
              {totalUploaded} 份
            </div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-100 text-warning-700 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">待上传材料</div>
            <div className="font-serif text-xl font-semibold text-slate-800">
              {totalMissingCount} 份
            </div>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">上传完成度</div>
            <div className="font-serif text-xl font-semibold text-slate-800">
              {totalMaterialCount > 0
                ? Math.round((totalUploaded / totalMaterialCount) * 100)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {materials.map((cat, catIdx) => {
          const uploaded = cat.uploadedCount;
          const missing = Math.max(0, cat.requiredCount - uploaded);
          const progress =
            cat.requiredCount > 0
              ? Math.min(100, (uploaded / cat.requiredCount) * 100)
              : cat.files.length > 0
              ? 100
              : 0;
          const isMissing = missing > 0 && cat.required;

          return (
            <section
              key={cat.id}
              className={cn(
                "card overflow-hidden transition-all duration-300",
                draggedOver === cat.id &&
                  "ring-2 ring-primary-400 ring-offset-2",
                isMissing && "border-warning-300"
              )}
              style={{
                animationDelay: `${catIdx * 60}ms`,
                animation: "fadeInUp 0.5s ease-out both",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDraggedOver(cat.id);
              }}
              onDragLeave={() => setDraggedOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDraggedOver(null);
                handleFileUpload(cat.id, e.dataTransfer.files);
              }}
            >
              <div className="card-header flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      isMissing
                        ? "bg-warning-100 text-warning-700"
                        : "bg-primary-100 text-primary-700"
                    )}
                  >
                    {isMissing ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <FolderOpen className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-serif font-semibold text-slate-800 flex items-center gap-2">
                      {cat.name}
                      {!cat.required && (
                        <span className="text-xs text-slate-400 font-normal">
                          （选传）
                        </span>
                      )}
                      {isMissing && (
                        <span className="text-xs text-warning-600 font-normal">
                          缺 {missing} 份
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{cat.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-slate-500">
                    {uploaded}/{cat.requiredCount || cat.files.length} 份
                  </div>
                  <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isMissing
                          ? "bg-gradient-to-r from-warning-400 to-warning-500"
                          : "bg-gradient-to-r from-success-400 to-success-500"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <button
                    onClick={() =>
                      fileInputRefs.current[cat.id]?.click()
                    }
                    className="btn-primary !py-1.5 !px-3 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    上传
                  </button>
                  <input
                    ref={(el) => (fileInputRefs.current[cat.id] = el)}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFileUpload(cat.id, e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              <div className="card-body pt-0">
                {cat.files.length === 0 ? (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
                      draggedOver === cat.id
                        ? "border-primary-400 bg-primary-50"
                        : "border-slate-200 bg-slate-50/50"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                      <Upload
                        className={cn(
                          "w-5 h-5 transition-colors",
                          draggedOver === cat.id
                            ? "text-primary-500"
                            : "text-slate-400"
                        )}
                      />
                    </div>
                    <div className="text-sm text-slate-600 mb-1">
                      拖拽文件到此处，或
                      <button
                        onClick={() =>
                          fileInputRefs.current[cat.id]?.click()
                        }
                        className="text-primary-600 hover:text-primary-700 font-medium mx-0.5"
                      >
                        点击选择文件
                      </button>
                    </div>
                    <div className="text-xs text-slate-400">
                      支持 PDF / Word / Excel / 图片，单文件不超过 50MB
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cat.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all group"
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                            file.type.startsWith("image/")
                              ? "bg-pink-50 text-pink-600"
                              : file.type.includes("pdf")
                              ? "bg-red-50 text-red-600"
                              : "bg-primary-50 text-primary-600"
                          )}
                        >
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-mono">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>{file.uploadTime}</span>
                            <span className="text-slate-300">•</span>
                            <span>{file.uploader}</span>
                            {getStatusBadge(file.status)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                            title="预览"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isFileContentAvailable(file)
                                ? "hover:bg-primary-50 text-slate-500 hover:text-primary-600"
                                : "text-slate-300 cursor-not-allowed"
                            )}
                            title={isFileContentAvailable(file) ? "下载" : "文件内容不可用，请重新上传"}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleRemove(cat.id, file.id, file.name)
                            }
                            className="p-2 rounded-lg hover:bg-danger-50 text-slate-500 hover:text-danger-600"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {isMissing && (
                      <div className="mt-3 p-3 rounded-xl bg-warning-50 border border-warning-200 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-warning-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-warning-700">
                          还需上传 <strong>{missing} 份</strong> 材料才能满足本类别的最低要求。
                          请检查材料清单并补充上传。
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex items-center justify-between pb-4">
        <div className="text-xs text-slate-500">
          <XCircle className="w-3.5 h-3.5 inline mr-1 text-danger-400" />
          缺少 {totalMissingCount} 份必传材料，请在提交前完成上传
        </div>
        <div className="flex items-center gap-2 no-print">
          <button className="btn-secondary">返回上一步</button>
          <button
            className={cn(
              "btn-primary px-6 py-2.5",
              totalMissingCount > 0 && "opacity-50 cursor-not-allowed"
            )}
            disabled={totalMissingCount > 0}
          >
            保存并进入下一步
          </button>
        </div>
      </div>

      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="card w-full max-w-lg shadow-paper animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                  {getFileIcon(previewFile.type)}
                </div>
                <div>
                  <div className="font-serif font-semibold text-slate-800">
                    文件预览
                  </div>
                  <div className="text-xs text-slate-500">
                    {previewFile.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="card-body space-y-4">
              <div className="aspect-video rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                {!isFileContentAvailable(previewFile) ? (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-danger-50 shadow-sm flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="w-7 h-7 text-danger-500" />
                    </div>
                    <div className="text-sm text-danger-600 font-medium">
                      文件内容不可用
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      该文件内容已丢失，请删除后重新上传
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
                      {getFileIcon(previewFile.type)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {previewFile.type.startsWith("image/")
                        ? "图片预览"
                        : "文件预览不可用"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      可下载后在本地查看
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">文件名</div>
                  <div className="font-medium text-slate-800 truncate">
                    {previewFile.name}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">文件大小</div>
                  <div className="font-mono text-slate-800">
                    {formatFileSize(previewFile.size)}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">文件类型</div>
                  <div className="text-slate-800 truncate">
                    {previewFile.type || "未知类型"}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">上传时间</div>
                  <div className="text-slate-800">{previewFile.uploadTime}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">上传人</div>
                  <div className="text-slate-800">{previewFile.uploader}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">审核状态</div>
                  <div>{getStatusBadge(previewFile.status)}</div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 rounded-b-xl">
              <button
                onClick={() => setPreviewFile(null)}
                className="btn-secondary"
              >
                关闭
              </button>
              <button
                onClick={() => handleDownload(previewFile)}
                disabled={!isFileContentAvailable(previewFile)}
                className={cn(
                  "btn-primary",
                  !isFileContentAvailable(previewFile) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Download className="w-4 h-4" />
                {isFileContentAvailable(previewFile) ? "下载文件" : "文件内容不可用"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
