import { ComponentProps } from "react";

type FieldsetProps = ComponentProps<"fieldset"> & {
  disabled?: boolean;
};

export default function Fieldset({
  children,
  disabled,
  ...rest
}: FieldsetProps) {
  return (
    <fieldset {...rest} disabled={disabled}>
      {children}
    </fieldset>
  );
}