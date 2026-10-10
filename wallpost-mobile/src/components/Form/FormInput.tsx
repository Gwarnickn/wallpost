import React from "react";
import Input from "./Input/Input";
import FormLabelWrapper from "./FormLabelWrapper/FormLabelWrapper";
import type { ErrorObj } from "./FormError";
import { GlobalError } from "./GlobalError";

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement> & {
    name: string;
    label?: string;
    value?: string | number | null;
    type?: string;
    globalErrors?: ErrorObj[];
};

export const FormInput: React.FunctionComponent<Props> = (
    {
        id,
        name,
        value,
        label,
        className,
        required,
        globalErrors,
        type,
        ...props
    }) => {
    if (label) {
        return (
            <FormLabelWrapper label={label} id={id} required={required} className={className}>
                <Input name={name} id={id} value={value} required={required} type={type} {...props}/>
                <GlobalError name={name} classname="error-message" errors={globalErrors}/>
            </FormLabelWrapper>
        )

    } else {
        return (
            <Input name={name} id={id} value={value} className={className} required={required} type={type} {...props}/>
        );
    }
};