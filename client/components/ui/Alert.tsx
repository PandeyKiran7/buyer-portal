type AlertVariant = "error" | "success";

type AlertProps = {
  variant: AlertVariant;
  children: React.ReactNode;
};

export function Alert({ variant, children }: AlertProps) {
  const cls = variant === "error" ? "bannerError" : "bannerSuccess";
  return (
    <div className={`banner ${cls}`} role="alert">
      {children}
    </div>
  );
}
