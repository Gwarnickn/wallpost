import React, { type HTMLAttributes } from "react";
import { renderIcon } from "../IconPicker/IconPicker";
import "./iconinputs.scss";

interface IconInputsProps extends HTMLAttributes<HTMLDivElement> {
  iconName: string;
}

const IconInput: React.FunctionComponent<IconInputsProps> = ({
  iconName,
  className,
  children,
  ...props
}) => {
  return (
    <div className={`iconinputs ${className}`} {...props}>
      <div className="icon">{renderIcon(iconName, 24)}</div>
      {children}
    </div>
  );
};

export default IconInput;
