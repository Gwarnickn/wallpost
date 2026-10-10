
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import './file-picker.scss'
import FormLabelWrapper from '../FormLabelWrapper/FormLabelWrapper';

type FilePickerProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement> & {
    label?: string;
    onFileChange: (file: File) => void;
};

const FilePicker = ({onFileChange, id, required, label, name}: FilePickerProps) => {
    const [picture, setPicture] = useState<string | undefined>()

    const selectMedia = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            const file = event.target.files[0]
            const newPicture = URL.createObjectURL(file);
            setPicture(newPicture);
            onFileChange(file);
        }
        
    }

    return (
        <FormLabelWrapper label={label} id={id} required={required}>
            <div className={`file-picker ${picture && 'picked'}`}>
                {picture !== undefined && <img src={picture}/>}
                <input name={name ?? id} type="file" onChange={selectMedia} required/>
            </div>
        </FormLabelWrapper>
    )
}
export default FilePicker;