import React from "react";
import FormLabelWrapper from "./FormLabelWrapper/FormLabelWrapper";
import type { ErrorObj } from "./FormError";
import { GlobalError } from "./GlobalError";
import Select from "./Select/Select";

type SelectOption = {
  label: string;
  value: string | number;
};

type Props = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
  label?: string;
  value?: string | number;
  options: SelectOption[];
  placeholder?: string;
  globalErrors?: ErrorObj[];
};

export const FormSelect: React.FunctionComponent<Props> = ({
  id,
  name,
  value,
  label,
  className,
  required,
  globalErrors,
  options,
  placeholder,
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
        <Select
          name={name}
          id={id}
          value={value}
          required={required}
          options={options}
          placeholder={placeholder}
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
      <Select
        name={name}
        id={id}
        value={value}
        className={className}
        required={required}
        options={options}
        placeholder={placeholder}
        {...props}
      />
    );
  }
};
