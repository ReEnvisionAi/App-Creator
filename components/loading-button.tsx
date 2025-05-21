import Spinner from "@/components/spinner";
import { ComponentProps } from "react";

type LoadingButtonProps = ComponentProps<"button"> & {
  loading?: boolean;
};

export default function LoadingButton({
  children,
  loading = false,
  ...rest
}: LoadingButtonProps) {
  return (
    <button {...rest} disabled={loading}>
      <Spinner loading={loading}>{children}</Spinner>
    </button>
  );
}