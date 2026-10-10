import './separator.scss'
import type { ReactNode } from 'react';

interface SeparatorProps{
    children: ReactNode;
    className?: string
}

const Separator = ({children, className}: SeparatorProps) => {
    return (
        <div className={`separator ${className}`}>
            <div className="line"/>
            <div className="text">
                {children}
            </div>
            <div className="line"/>
        </div>
    )
}
export default Separator;