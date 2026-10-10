import React from "react";
import FormLabelWrapper from "./FormLabelWrapper/FormLabelWrapper";
import type { ErrorObj } from "./FormError";
import { GlobalError } from "./GlobalError";
import IconPicker from "./IconPicker/IconPicker";

type Props = {
  name: string;
  label?: string;
  value?: string;
  onChange?: (iconName: string) => void;
  availableIcons: string[];
  required?: boolean;
  id?: string;
  className?: string;
  globalErrors?: ErrorObj[];
};

export const FormIconPicker: React.FunctionComponent<Props> = ({
  id,
  name,
  value,
  label,
  className,
  required,
  globalErrors,
  onChange,
  availableIcons,
  ...props
}) => {
  if (label) {
    return (
      <FormLabelWrapper
        label={label}
        id={id}
        required={required}
        className={className}
      >
        <IconPicker
          name={name}
          value={value}
          onChange={onChange}
          availableIcons={availableIcons}
          {...props}
        />
        <GlobalError
          name={name}
          classname="error-message"
          errors={globalErrors}
        />
      </FormLabelWrapper>
    );
  } else {
    return (
      <IconPicker
        name={name}
        value={value}
        onChange={onChange}
        availableIcons={availableIcons}
        {...props}
      />
    );
  }
};
