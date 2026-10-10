import React from "react";
import FormLabelWrapper from "./FormLabelWrapper/FormLabelWrapper";
import type { ErrorObj } from "./FormError";
import { GlobalError } from "./GlobalError";
import TextArea from "./TextArea/TextArea";

type Props = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  name: string;
  label?: string;
  value?: string | number;
  globalErrors?: ErrorObj[];
};

export const FormTextArea: React.FunctionComponent<Props> = ({
  id,
  name,
  value,
  label,
  className,
  required,
  globalErrors,
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
        <TextArea
          name={name}
          id={id}
          value={value}
          required={required}
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
      <TextArea
        name={name}
        id={id}
        value={value}
        className={className}
        required={required}
        {...props}
      />
    );
  }
};
