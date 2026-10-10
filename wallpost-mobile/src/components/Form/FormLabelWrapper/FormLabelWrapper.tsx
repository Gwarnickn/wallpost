import React, { type JSX } from "react";
import './form-label-wrapper.scss';

type FormLabelWrapperProps = {
    id?: string;
    label?: string;
    className?: string;
    required?: boolean;
    name?: string;
    children: string | JSX.Element | JSX.Element[];
}

const FormLabelWrapper:React.FunctionComponent<FormLabelWrapperProps> = ({children, id, label, className}) =>{

    return(
        <div className={`form-label-wrapper ${className}`}>
            {label && (
                <label htmlFor={id} className="label">
                    {label}
                </label>
            )}
            {children}
        </div>
    )
}
export default FormLabelWrapper;