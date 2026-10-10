import React from "react";
import "./select.scss";

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  name: string;
  options: SelectOption[];
  placeholder?: string;
};

const Select: React.FunctionComponent<SelectProps> = ({
  className,
  name,
  id,
  options,
  placeholder,
  required,
  value,
  ...props
}) => {
  return (
    <select
      id={id || name}
      className={`form-select ${className}`}
      name={name}
      required={required}
      value={value}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
