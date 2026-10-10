import React from "react";
import "./textarea.scss";

type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  name: string;
};

const TextArea: React.FunctionComponent<TextAreaProps> = ({
  className,
  name,
  id,
  placeholder,
  required,
  rows,
  cols,
  ...props
}) => {
  return (
    <textarea
      id={id || name}
      className={`form-text-area ${className}`}
      name={name}
      rows={rows}
      cols={cols}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  );
};
export default TextArea;
