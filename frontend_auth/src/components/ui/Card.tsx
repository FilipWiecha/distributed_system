import type { ReactNode } from "react";

export function Card({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={"panel " + className}>
      {title && (
        <header className="panel-header">
          <div>
            <h2>{title}</h2>
            {description && <p className="panel-sub">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeading({
  title,
  description,
  breadcrumb,
  badge,
  action,
}: {
  title: string;
  description: string;
  breadcrumb?: string;
  badge?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="title-row">
      <div className="title-main">
        {breadcrumb && <div className="breadcrumb mono">{breadcrumb}</div>}
        <div className="title-headline-wrap">
          <h1>{title}</h1>
          {badge}
        </div>
        <p className="sub">{description}</p>
      </div>
      {action && <div className="title-actions">{action}</div>}
    </div>
  );
}

export function ComingSoon() {
  return <span className="pill">Wkrótce</span>;
}
