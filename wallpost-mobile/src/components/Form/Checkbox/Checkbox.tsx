import React from "react";
import './checkbox.scss';

type Props = Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,"value"> & {
    name: string;
    value: boolean;
    revesed?: boolean;
};

export const Checkbox: React.FunctionComponent<Props> = ({
    name,
    id,
    children,
    className,
    value,
    onClick,
    revesed,
    ...props
}) => {
    return (
        <div className={`checkbox-wrapper  ${className}`} style={revesed ? {flexDirection: "row"} : {}} onClick={onClick}>
            <div className="caption">{children}</div>
            <input className={`${value === true ? "checked" : ""}`} type="checkbox" name={name} id={id ? id : name} {...props} />
        </div>
    );
};