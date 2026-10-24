import { Link } from "react-router-dom";
import { PageHeading } from "../ui/Card";
export function PageHeader({
  title,
  description,
  actionLink,
  actionText,
}: {
  title: string;
  description?: string;
  actionLink?: string;
  actionText?: string;
}) {
  return (
    <PageHeading
      title={title}
      description={description || ""}
      breadcrumb="mojprojekt.test / gym"
      action={
        actionLink && actionText ? (
          <Link className="button button-primary" to={actionLink}>
            {actionText}
          </Link>
        ) : undefined
      }
    />
  );
}
