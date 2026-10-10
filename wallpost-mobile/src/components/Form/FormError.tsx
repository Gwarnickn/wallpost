import {type FunctionComponent, useEffect, useState} from 'react';

export type ErrorObj = {
    fieldName?: string,
    message: string
};

type Props = {
    errors?: ErrorObj[],
    name: string
};


export const FormError: FunctionComponent<Props> = ({errors, name}) => {
    const [message, setMessage] = useState<string | undefined>();

    useEffect(() => {
        const error = errors?.find(error => error.fieldName === name);
        setMessage(error?.message);
    }, [errors])

    return (
        <div className="error-container">
            {message && <span className="error-message">ⓘ {message}</span>}
        </div>
    );
};