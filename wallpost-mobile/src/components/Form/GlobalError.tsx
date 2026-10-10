import {type FunctionComponent, useEffect, useState} from 'react';
import {type ErrorObj, FormError} from "./FormError";

type Props = {
    errors?: ErrorObj[];
    name?: string;
    classname?: string;
};

export const GlobalError: FunctionComponent<Props> = ({errors, name, classname}) => {
    const [messages, setMessages] = useState<string[] | undefined>([]);

    useEffect(() => {
        const errorList: string[] = [];

        if (Array(errors)) {
            errors?.map(error => {
                if (!error.fieldName) {
                    if (error.message) {
                        errorList.push(error.message);
                    }
                }
            });
        }
        setMessages(errorList);
    }, [errors])

    return (
        <div className={classname}>
            {
                name ? (
                        <FormError errors={errors} name={name}/>)
                    : (
                        <div className="global-error-message">
                            {messages && messages.map((message, index) => (<p key={"GlobalError " + index + " :" + message} className="error-message">{message}</p>)
                            )}
                        </div>
                    )
            }
        </div>
    );
};