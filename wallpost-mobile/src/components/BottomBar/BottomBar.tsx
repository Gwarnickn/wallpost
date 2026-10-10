import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../Button/Button'
import './bottom-bar.scss'
import type { ReactNode } from 'react'
import { User, ListBulleted, UsersGroup } from 'griddy-icons'
import { useState } from 'react'

const bottomBarButtons:{id: number,icon: ReactNode, label: string, to: string}[] = [
    {
        id: 0,
        icon: <ListBulleted/>,
        label: 'Feed',
        to:  'feed',
    },
    {
        id: 1,
        icon: <UsersGroup/>,
        label: 'Map',
        to:  'map',
    },
    {
        id: 2,
        icon: <User/>,
        label: 'Profile',
        to:  'profile',
    }
]

const BottomBar = () => {
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const [currentButton, setCurrentButton] = useState(0);

    const navigateTo = (btn:{id: number,icon: ReactNode, label: string, to: string}) => {
        if(!location.includes(btn.to)){
            navigate(btn.to);
            setCurrentButton(btn.id);
        }
    }

    return (
        <div className="bottom-bar">
            {bottomBarButtons.map(btn => (
                <Button className={`button-none white-ripple ${location.includes(btn.to) && 'active'}`} onClick={() => {navigateTo(btn)}}>{btn.icon}{btn.label}</Button>
            ))}
            <div className="pill" style={{transform: `translate(${(currentButton - 1) * 100}%,0px)`}}/>
        </div>
    )
}
export default BottomBar