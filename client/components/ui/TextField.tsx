import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
  id: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, id, error, className = "", ...inputProps }: TextFieldProps) {
  return (
    <div className={className}>
      <label className="fieldLabel" htmlFor={id}>
        {label}
      </label>
      <input className="fieldInput" id={id} {...inputProps} />
      {error ? <p className="fieldError">{error}</p> : null}
    </div>
  );
}
