type AuthPageHeaderProps = {
  title: string;
  description: string;
};

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <>
      <h1 className="pageTitle">{title}</h1>
      <p className="muted">{description}</p>
    </>
  );
}
