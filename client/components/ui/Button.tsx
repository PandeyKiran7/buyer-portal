import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "btnPrimary",
  secondary: "btnSecondary",
  danger: "btnDanger",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const v = variantClass[variant];
  return <button type={type} className={`btn ${v} ${className}`.trim()} {...rest} />;
}
