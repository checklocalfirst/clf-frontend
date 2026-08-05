"use client";

import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";

const inputCls =
  "h-[44px] w-full bg-white border border-[#dbe0d9] rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const inputErrCls =
  "h-[44px] w-full bg-white border border-red-400 rounded-[8px] px-4 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-red-500 transition-colors";
const textareaCls =
  "w-full min-h-[100px] bg-white border border-[#dbe0d9] rounded-[8px] px-4 py-3 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-[#2c4a34] transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed";
const textareaErrCls =
  "w-full min-h-[100px] bg-white border border-red-400 rounded-[8px] px-4 py-3 font-body text-[14px] text-[#423926] placeholder:text-[#b7a78c] outline-none focus:border-red-500 transition-colors resize-none";
const labelCls = "font-body font-semibold text-[13px] text-[#423926]";
const hintCls = "font-body text-[12px] text-[#b7a78c]";
const errorCls = "font-body text-[12px] text-red-600";

type BaseProps = {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  className?: string;
};

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & { as?: "input" };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> & { as: "textarea" };

type SelectProps = BaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className"> & {
    as: "select";
    children: ReactNode;
  };

function omit<T extends object>(obj: T, keys: (keyof T)[]): Partial<T> {
  const clone = { ...obj };
  for (const key of keys) delete clone[key];
  return clone;
}

/** Shared label + input/textarea/select + hint/error, matching the design system's form styling. */
export default function FormField(props: InputProps | TextareaProps | SelectProps) {
  const { label, id, error, hint, className = "" } = props;

  let control: ReactNode;
  if (props.as === "textarea") {
    const rest = omit(props, ["label", "id", "error", "hint", "className", "as"]);
    control = (
      <textarea id={id} name={id} className={error ? textareaErrCls : textareaCls} {...rest} />
    );
  } else if (props.as === "select") {
    const { children, ...others } = props;
    const rest = omit(others, ["label", "id", "error", "hint", "className", "as"]);
    control = (
      <select id={id} name={id} className={error ? inputErrCls : inputCls} {...rest}>
        {children}
      </select>
    );
  } else {
    const rest = omit(props, ["label", "id", "error", "hint", "className", "as"]);
    control = <input id={id} name={id} className={error ? inputErrCls : inputCls} {...rest} />;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {control}
      {hint && !error && <p className={hintCls}>{hint}</p>}
      {error && <p className={errorCls}>{error}</p>}
    </div>
  );
}
