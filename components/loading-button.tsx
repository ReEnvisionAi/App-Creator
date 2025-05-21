import Spinner from "@/components/spinner";
import { ComponentProps } from "react";

interface LoadingButtonProps extends ComponentProps<"button"> {
  pending?: boolean;
}

export default function LoadingButton({
  children,
  pending = false,
  ...rest
}: LoadingButtonProps) {
  return (
    <button {...rest} disabled={pending}>
      <Spinner loading={pending}>{children}</Spinner>
    </button>
  );
}