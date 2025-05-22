import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ComponentProps } from "react";

type NewLinkProps = {
  newQuery?: Record<string, string | number | null>;
  href?: string;
};

export default function NewLink({
  href,
  newQuery,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "to"> & NewLinkProps) {
  const location = useLocation();

  let finalHref = href || location.pathname;

  if (newQuery) {
    const params = new URLSearchParams(location.search);

    // Then, add new params from newQuery
    Object.entries(newQuery).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else if (value === null) {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    finalHref = `${finalHref}${queryString ? `?${queryString}` : ""}`;
  }

  return (
    <Link to={finalHref} {...props}>
      {children}
    </Link>
  );
}