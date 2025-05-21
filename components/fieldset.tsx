import { ComponentProps } from "react";

export default function Fieldset({
  children,
  ...rest
}: ComponentProps<"fieldset">) {
  return (
    <fieldset {...rest}>
      {children}
    </fieldset>
  );
}