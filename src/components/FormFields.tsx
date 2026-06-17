
import React, { useState } from "react";
import { AlertTriangle, CheckCircle, ChevronDown, X } from "lucide-react";
import { cn } from "@/components/Layout";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  warning?: string;
  children: React.ReactNode;
  className?: string;
  labelExtra?: React.ReactNode;
}

export function FormField({
  label,
  required,
  error,
  hint,
  warning,
  children,
  className,
  labelExtra,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <label className={cn("label-base", required && "label-required")}>
          {label}
        </label>
        {labelExtra}
      </div>
      <div className={cn(error && "animate-shake")}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              className: cn(
                (children as any).props?.className,
                error && "input-error"
              ),
            })
          : children}
      </div>
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-danger-600">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {!error && warning && (
        <div className="flex items-start gap-1.5 text-xs text-warning-700 bg-warning-50 px-2.5 py-2 rounded-lg border border-warning-200">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}
      {!error && !warning && hint && (
        <div className="text-xs text-slate-500">{hint}</div>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unit?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, unit, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          className={cn(
            "input-base",
            unit && "pr-12",
            className
          )}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
            {unit}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...props}
      className={cn("input-base resize-y leading-relaxed", className)}
    />
  );
});
TextArea.displayName = "TextArea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          {...props}
          className={cn(
            "input-base appearance-none pr-10 cursor-pointer",
            className
          )}
        >
          {children}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2.5 cursor-pointer select-none group",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            "w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center",
            checked
              ? "bg-primary-600 border-primary-600 shadow-card"
              : "bg-white border-slate-300 group-hover:border-primary-400"
          )}
        >
          <CheckCircle
            className={cn(
              "w-3.5 h-3.5 text-white transition-all duration-200",
              checked ? "animate-check opacity-100" : "opacity-0 scale-50"
            )}
            strokeWidth={3}
          />
        </div>
      </div>
      {label && (
        <span className="text-sm text-slate-700 group-hover:text-slate-900">
          {label}
        </span>
      )}
    </label>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled,
}: ToggleSwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-300",
          checked ? "bg-success-600" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        className="sr-only"
      />
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
    </label>
  );
}

interface TagListInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagListInput({
  values,
  onChange,
  placeholder,
}: TagListInputProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const v = input.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
    }
    setInput("");
  };

  const handleRemove = (val: string) => {
    onChange(values.filter((v) => v !== val));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder || "输入后按回车添加"}
          className="input-base flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="btn-secondary shrink-0"
        >
          添加
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium border border-primary-200"
            >
              {v}
              <button
                type="button"
                onClick={() => handleRemove(v)}
                className="p-0.5 rounded-full hover:bg-primary-100 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  extra?: React.ReactNode;
  steps?: { label: string; status: "completed" | "current" | "pending" }[];
}

export function PageHeader({
  title,
  subtitle,
  icon,
  extra,
  steps,
}: PageHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-card shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="font-serif text-2xl lg:text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {extra && <div className="shrink-0">{extra}</div>}
      </div>

      {steps && steps.length > 0 && (
        <div className="card p-4 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    s.status === "completed"
                      ? "bg-success-600 text-white"
                      : s.status === "current"
                      ? "bg-primary-600 text-white shadow-glow"
                      : "bg-slate-200 text-slate-500"
                  )}
                >
                  {s.status === "completed" ? (
                    <CheckCircle className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    s.status === "current"
                      ? "text-primary-700"
                      : s.status === "completed"
                      ? "text-success-700"
                      : "text-slate-400"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 lg:w-16 h-0.5 rounded-full shrink-0",
                    s.status === "completed" ? "bg-success-500" : "bg-slate-200"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
